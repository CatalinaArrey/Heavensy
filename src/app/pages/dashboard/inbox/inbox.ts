import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

import { ProspectCardComponent } from '../../../shared/components/prospect-card/prospect-card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Dialog,DialogModule } from '@angular/cdk/dialog';
import { forkJoin } from 'rxjs';
import { ChatService } from '../../../core/services/chat.service';
import { InputDialogComponent, InputDialogData } from '../../../shared/components/dialog/input-dialog/input-dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/dialog/confirm-dialog/confirm-dialog';
import { RealtimeService, LatticeMessage } from '../../../core/services';

@Component({
  selector: 'app-inbox',
  imports: [CommonModule ,CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder, ProspectCardComponent, DialogModule, HttpClientModule],
  templateUrl: './inbox.html',
  styleUrls: ['./inbox.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
  private storageKey = 'misClientes';
  private realtime = inject(RealtimeService);
  private subs: Subscription[] = [];
  
  constructor(private dialog: Dialog, private http: HttpClient, private router: Router, private chatService: ChatService) {}
  grupos: any[] = [];

  ngOnInit() {
    // 1. Load from localStorage first to preserve user's column assignments
    this.cargarGrupos();
    
    // 2. Then fetch from API and merge, preserving group assignments
    this.chatService.getConversaciones().subscribe({
      next: (res: any) => {
        const convos = Array.isArray(res) ? res : (res.conversations || res.data || []);

        if (convos && convos.length) {
          const contactosAPI = (convos || []).map((c: any) => ({
            nombre: c.profile_name || c.nombre || c.title || c.displayName || c.user || c.phone || 'Contacto',
            desc: c.last_message_text || c.ultimoMensaje || (c.last_message && (c.last_message.text || c.last_message.body)) || '',
            source: c.platform || c.messaging_product || c.plataforma || 'web',
            id: c.userId || c.id || c.phone || c._id || `${Math.random().toString(36).slice(2,9)}`,
            avatar: c.avatar || ''
          }));

          // Merge: preserve existing group assignments, add new contacts to PROSPECTOS
          const grupoProspectos = this.grupos.find(g => g.id === 'prospectos');
          const contactosExistentes = new Set();
          
          // Collect existing contact names to avoid duplicates
          this.grupos.forEach(g => {
            g.prospectos.forEach((p: any) => contactosExistentes.add(p.nombre.toLowerCase()));
          });

          // Add new contacts from API to PROSPECTOS if not already present
          contactosAPI.forEach((c: any) => {
            if (!contactosExistentes.has(c.nombre.toLowerCase())) {
              if (grupoProspectos) {
                grupoProspectos.prospectos.push({ ...c, group: 'prospectos' });
              }
            } else {
              // Update existing contact's description
              for (const grupo of this.grupos) {
                const existing = grupo.prospectos.find((p: any) => p.nombre.toLowerCase() === c.nombre.toLowerCase());
                if (existing) {
                  existing.desc = c.desc;
                  existing.source = c.source;
                  existing.avatar = c.avatar;
                  break;
                }
              }
            }
          });

          this.guardarGrupos();
        }

        this.escucharMensajes();
      },
      error: (err: any) => {
        console.warn('[Inbox] fallo al cargar conversaciones desde API', err);
        this.escucharMensajes();
      }
    });
  }

  cargarGrupos() {
    const dataGuardada = localStorage.getItem(this.storageKey);
    if (dataGuardada) {
      this.grupos = JSON.parse(dataGuardada);
    } else {
      // Default to empty groups (do not inject dummy data)
      this.grupos = [
        { id: 'prospectos', titulo: 'PROSPECTOS', prospectos: [] },
        { id: 'clientes', titulo: 'CLIENTES', prospectos: [] }
      ];
      this.guardarGrupos();
    }
  }

  guardarGrupos() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.grupos));
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    // después del movimiento, asignar la propiedad `group` al elemento movido
    try {
      const targetArr = event.container.data;
      const moved = targetArr[event.currentIndex];
      const targetGroup = this.grupos.find(g => g.prospectos === targetArr);
      if (moved && targetGroup) moved.group = targetGroup.id;
    } catch (e) {
      // ignore
    }

    this.guardarGrupos();
  }

  agregarColumna() {
    const dialogRef = this.dialog.open<string>(InputDialogComponent, {
      data: { title: 'Crear Columna', message: 'Ingresa el nombre de la nueva columna:' } as InputDialogData,
      backdropClass: 'cdk-overlay-dark-backdrop', 
    });

    dialogRef.closed.subscribe(nombreColumna => {
      if (nombreColumna && nombreColumna.trim() !== '') {
        const nuevoId = nombreColumna.trim().toLowerCase().replace(/\s+/g, '-');
        this.grupos.push({
          id: nuevoId,
          titulo: nombreColumna.trim().toUpperCase(),
          prospectos: []
        });
        this.guardarGrupos();
      }
    });
  }

  eliminarColumna(idColumnaAEliminar: string) {
    
    if (idColumnaAEliminar === 'prospectos') {
      this.dialog.open(ConfirmDialogComponent, {
        data: { 
          title: 'Acción No Permitida', 
          message: 'No puedes eliminar la columna principal de Prospectos.',
          showCancel: false 
        } as ConfirmDialogData,
        backdropClass: 'cdk-overlay-dark-backdrop',
      });
      return;
    }const dialogRef = this.dialog.open<boolean>(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro? Todos sus elementos se moverán a \'Prospectos\'.',
        showCancel: true 
      } as ConfirmDialogData,
      backdropClass: 'cdk-overlay-dark-backdrop',
    });

    dialogRef.closed.subscribe(confirmado => {
      if (confirmado) {
        const columnaProspectos = this.grupos.find(g => g.id === 'prospectos');
        if (!columnaProspectos) return; 
        
        const indexColumnaAEliminar = this.grupos.findIndex(g => g.id === idColumnaAEliminar);
        if (indexColumnaAEliminar === -1) return;
        
        const columnaAEliminar = this.grupos[indexColumnaAEliminar];
        columnaProspectos.prospectos.push(...columnaAEliminar.prospectos);
        this.grupos.splice(indexColumnaAEliminar, 1);

        this.guardarGrupos();
      }
    });
  }

  /**
   * Escucha los mensajes en tiempo real del WebSocket
   * y los añade a los grupos de clientes
   */
  escucharMensajes() {
    console.log('[Inbox] Iniciando escucha de mensajes...');
    this.subs.push(
      this.realtime.onNewMessage().subscribe((msg: LatticeMessage) => {
        console.log('[Inbox] ✅ Nuevo mensaje recibido:', msg);
        this.agregarOActualizarCliente(msg);
      }, (error) => {
        console.error('[Inbox] ❌ Error en suscripción:', error);
      })
    );
    console.log('[Inbox] Suscripción establecida. Total suscripciones:', this.subs.length);
  }

  /**
   * Agrega o actualiza un cliente con el nuevo mensaje
   */
  private agregarOActualizarCliente(msg: LatticeMessage) {
    const nombreContacto = msg.profile_name || 'Contacto desconocido';
    const textoMensaje = this.extraerTexto(msg);
    const plataforma = msg.messaging_product || 'whatsapp';

    console.log(`[Inbox] Procesando cliente: ${nombreContacto}`);

    // Buscar el cliente en todos los grupos
    let clienteEncontrado = false;
    
    for (const grupo of this.grupos) {
      const cliente = grupo.prospectos.find(
        (p: any) => p.nombre.toLowerCase() === nombreContacto.toLowerCase()
      );
      
      if (cliente) {
        // Actualizar el mensaje del cliente existente
        console.log(`[Inbox] ✅ Cliente ENCONTRADO: ${nombreContacto}. Actualizando...`);
        cliente.desc = textoMensaje;
        cliente.source = plataforma;
        clienteEncontrado = true;
        break;
      }
    }

    // Si no existe, crear nuevo cliente en el primer grupo (PROSPECTOS)
    if (!clienteEncontrado) {
      console.log(`[Inbox] ⭐ Cliente NUEVO: ${nombreContacto}. Creando...`);
      const grupoProspectos = this.grupos.find(g => g.id === 'prospectos');
      if (grupoProspectos) {
        grupoProspectos.prospectos.unshift({
          nombre: nombreContacto,
          desc: textoMensaje,
          source: plataforma
        });
        console.log(`[Inbox] ✅ Cliente ${nombreContacto} agregado a PROSPECTOS`);
      } else {
        console.error('[Inbox] ❌ No se encontró grupo PROSPECTOS');
      }
    }

    // Guardar cambios
    console.log(`[Inbox] 💾 Guardando grupos... Total clientes: ${this.grupos.reduce((sum, g) => sum + g.prospectos.length, 0)}`);
    this.guardarGrupos();
  }

  abrirChat(prospecto: any) {
    // Navegar a la vista de chat pasando userId como query param
    const id = prospecto.id || prospecto.nombre;
    this.router.navigate(['/dashboard/chat'], { queryParams: { userId: id } });
  }

  /**
   * Extrae el texto del mensaje en diferentes formatos
   */
  private extraerTexto(msg: LatticeMessage): string {
    if (typeof msg.text === 'string') return msg.text;
    if (msg.text && typeof msg.text === 'object' && 'body' in msg.text) {
      return (msg.text as { body: string }).body;
    }
    return msg.body || msg['message'] || '(sin texto)';
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.realtime.disconnect();
  }
}