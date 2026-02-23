import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../../../core/services/chat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);

  // REFERENCIA AL CONTENEDOR DE MENSAJES (para el scroll)
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('fileDocument') private fileDocument!: ElementRef<HTMLInputElement>;
  @ViewChild('fileMedia') private fileMedia!: ElementRef<HTMLInputElement>;
  @ViewChild('fileCamera') private fileCamera!: ElementRef<HTMLInputElement>;
  @ViewChild('fileAudio') private fileAudio!: ElementRef<HTMLInputElement>;
  @ViewChild('filePickerPopover') private filePickerPopover!: ElementRef;
  @ViewChild('attachBtn') private attachBtn!: ElementRef;


  shortcuts = [
    { id: 1, comando: '/gracias', texto: '¡Muchas gracias por contactarnos! ¿En qué más podemos ayudarte?' },
    { id: 2, comando: '/precios', texto: 'Nuestros servicios de psicoterapia tienen un valor de $XXXX por sesión.' },
    { id: 3, comando: '/ubicacion', texto: 'Estamos ubicados en Calle Falsa 123, Providencia.' },
    { id: 4, comando: '/horarios', texto: 'Nuestros horarios de atención son de Lunes a Viernes de 09:00 a 18:00 hrs.' }
  ];
  contactos: any[] = [];
  contactoSeleccionado: any = null;
  mensajeInput = '';
  companyId: string = ''; // Para manejar el ID real de la empresa
  
  inboxGrupos = [
    { id: 'prospectos', titulo: 'PROSPECTOS' },
    { id: 'clientes', titulo: 'CLIENTES' }
  ];

  mensajesActual: Array<{ texto: string; esEnviado: boolean; timestamp: string }> = [];
  showFilePicker: boolean = false;
  loading = false;
  private lastChatKey = 'ultimo_chat_abierto_id'; 

  ngOnInit() {
    this.cargarConversaciones();
    this.resolverCompanyId(); 
  }

  toggleFilePicker() {
    this.showFilePicker = !this.showFilePicker;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.showFilePicker) return;
    const target = event.target as HTMLElement;

    const popEl = this.filePickerPopover?.nativeElement as HTMLElement | undefined;
    const btnEl = this.attachBtn?.nativeElement as HTMLElement | undefined;

    if (popEl && (popEl === target || popEl.contains(target))) {
      return; // click inside popover -> ignore
    }

    if (btnEl && (btnEl === target || btnEl.contains(target))) {
      return; // click on the attach button -> ignore
    }

    // otherwise close
    this.showFilePicker = false;
  }

  usarShortcut(texto: string) {
    // Seteamos el texto en el input del chat
    this.mensajeInput = texto;
    
    // Opcional: Si quieres que se envíe automáticamente, descomenta la siguiente línea:
    // this.enviarMensaje();
    
    // Foco automático al input (opcional pero recomendado para UX)
    const inputEl = document.querySelector('.mensaje-input') as HTMLInputElement;
    if (inputEl) inputEl.focus();
  }

  selectFileType(type: string) {
    // Trigger the corresponding hidden input
    setTimeout(() => {
      switch(type) {
        case 'document':
          this.fileDocument?.nativeElement?.click();
          break;
        case 'media':
          this.fileMedia?.nativeElement?.click();
          break;
        case 'camera':
          this.fileCamera?.nativeElement?.click();
          break;
        case 'audio':
          this.fileAudio?.nativeElement?.click();
          break;
        case 'contact':
          this.openContacts();
          break;
      }
      this.showFilePicker = false;
    }, 50);
  }

  handleFile(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    const fileNames = Array.from(input.files).map(f => f.name).join(', ');

    // Añadimos un mensaje visual simple indicando el archivo seleccionado
    this.mensajesActual.push({
      texto: `[Archivo ${type} seleccionado: ${fileNames}]`,
      esEnviado: true,
      timestamp: new Date().toISOString()
    });

    if (this.contactoSeleccionado) {
      this.contactoSeleccionado.ultimoMensaje = `[Archivo: ${fileNames}]`;
    }

    // Limpieza del input para permitir volver a elegir el mismo archivo
    input.value = '';

    // Forzar scroll abajo
    setTimeout(() => this.scrollToBottom(), 100);
  }

  

  openContacts() {
    // Placeholder: aquí puedes abrir tu selector de contactos real.
    // Por ahora mostramos una notificación simple en consola y añadimos mensaje.
    console.log('Abrir selector de contactos (pendiente implementar)');
    this.mensajesActual.push({
      texto: `[Selector de contactos abierto]`,
      esEnviado: true,
      timestamp: new Date().toISOString()
    });
    setTimeout(() => this.scrollToBottom(), 100);
  }

  // Se ejecuta cada vez que cambia la vista (ej: llega mensaje) -> Baja el scroll
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  // MÉTODO PARA BAJAR EL SCROLL AUTOMÁTICAMENTE
  scrollToBottom(): void {
    try {
      if(this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  // Busca el ID de empresa para evitar el error 404 con LATTICE_001
  resolverCompanyId() {
    const savedId = localStorage.getItem('company_id');
    if (savedId && savedId !== 'undefined') {
      this.companyId = savedId;
      return;
    }

    this.chatService.getConversaciones().subscribe({
        next: () => console.log('Empresas verificadas implícitamente'),
        error: () => this.companyId = 'LATTICE_001' // Fallback
    });
    // Nota: Si tienes un endpoint getEmpresas() implementado, úsalo aquí mejor.
    this.companyId = 'LATTICE_001'; 
  }

  cargarConversaciones() {
    this.chatService.getConversaciones().subscribe({
      next: (res: any) => {
        const listaRaw = res.conversations || res.data || (Array.isArray(res) ? res : []);

        this.contactos = listaRaw.map((c: any) => {
          return {
            id: c.phone || c.user_id || c.id,
            nombre: c.profile_name || c.phone || 'Usuario Desconocido',
            avatar: this.generarAvatar(c.profile_name || c.phone), 
            ultimoMensaje: c.last_message || c.last_message_text || '', 
            timestamp: c.last_timestamp || c.timestamp || new Date().toISOString(),
            noLeidos: c.unread_count || 0,
            plataforma: c.source || 'whatsapp',
            group: 'prospectos'
          };
        });

        // Recuperar último chat abierto
        const userIdParam = this.route.snapshot.queryParamMap.get('userId');
        const lastChatId = localStorage.getItem(this.lastChatKey);
        const idParaAbrir = userIdParam || lastChatId;

        if (idParaAbrir) {
          const contactoEncontrado = this.contactos.find(c => String(c.id) === String(idParaAbrir));
          if (contactoEncontrado) {
            this.seleccionarContacto(contactoEncontrado);
          }
        } else if (this.contactos.length > 0) {
          // Si no hay último chat guardado, seleccionar el primero
          this.seleccionarContacto(this.contactos[0]);
        }
      },
      error: (err) => console.error('[Chat] Error cargando conversaciones:', err)
    });
  }

  seleccionarContacto(contacto: any) {
    this.contactoSeleccionado = contacto;
    localStorage.setItem(this.lastChatKey, String(contacto.id));
    this.mensajesActual = [];
    this.loading = true;

    this.chatService.getMensajesDe(contacto.id).subscribe({
      next: (res: any) => {
        const mensajesRaw = res.messages || res.data || (Array.isArray(res) ? res : []);
        
        this.mensajesActual = mensajesRaw.map((m: any) => {
          // Detectar si el mensaje es mío (asistente) o del usuario
          const esMio = m.role === 'assistant' || m.sender_type === 'assistant' || m.from === 'me';
          return {
            texto: m.content || m.text || m.body || '',
            esEnviado: esMio,
            timestamp: m.timestamp || new Date().toISOString()
          };
        });
        
        this.loading = false;
        // Forzar scroll abajo al cargar
        setTimeout(() => this.scrollToBottom(), 100); 
      },
      error: (err) => {
        console.error('[Chat] Error:', err);
        this.loading = false;
      }
    });
  }

  obtenerMensajes() {
    return this.mensajesActual;
  }

  enviarMensaje() {
    if (!this.mensajeInput.trim() || !this.contactoSeleccionado) return;

    const texto = this.mensajeInput;
    const telefono = this.contactoSeleccionado.id;

    // UI Optimista
    this.mensajesActual.push({
      texto: texto,
      esEnviado: true,
      timestamp: new Date().toISOString()
    });
    
    this.contactoSeleccionado.ultimoMensaje = texto;
    this.mensajeInput = '';
    
    // Enviar al Backend
    // IMPORTANTE: Usamos this.companyId que resolvimos al inicio
    const idEmpresa = this.companyId || 'LATTICE_001';
    
    this.chatService.enviarMensaje(telefono, texto, idEmpresa).subscribe({
      next: () => console.log('Mensaje enviado OK'),
      error: (err) => console.error('Error enviando:', err)
    });
  }

  private generarAvatar(nombre: string): string {
    const letra = nombre ? nombre.charAt(0).toUpperCase() : '?';
    return `https://ui-avatars.com/api/?name=${letra}&background=random&color=fff`;
  }
  
  onGroupChange(nuevoGrupoId: string) {
    if(this.contactoSeleccionado) {
        this.contactoSeleccionado.group = nuevoGrupoId;
    }
  }
}