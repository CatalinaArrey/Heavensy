import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  currentView = signal<string>('perfil'); 
  
  perfilData = signal<any>(null);
  dashboardData = signal<any>(null);
  serviciosData = signal<any[]>([]);
  facturacionData = signal<any>(null);

  editPerfilData = signal<any>(null);
  showUpgradeModal = signal<boolean>(false);
  
  // Nuevo signal para controlar el popup de éxito
  showSuccessModal = signal<boolean>(false);

  ngOnInit() {
    this.cargarDatos();
  }

  cambiarVista(vista: string) {
    this.currentView.set(vista);
  }

  private cargarDatos() {
    // Cargar JSONs desde la ruta pública de assets
    this.http.get('/assets/data/perfil.json').subscribe({ next: data => this.perfilData.set(data), error: () => this.perfilData.set(null) });
    this.http.get('/assets/data/dashboard.json').subscribe({ next: data => this.dashboardData.set(data), error: () => this.dashboardData.set(null) });
    this.http.get('/assets/data/servicios.json').subscribe({ next: data => this.serviciosData.set(data as any[]), error: () => this.serviciosData.set([]) });
    this.http.get('/assets/data/facturacion.json').subscribe({ next: data => this.facturacionData.set(data), error: () => this.facturacionData.set(null) });
  }

  toggleServicio(servicio: any) {
    servicio.activo = !servicio.activo;
  }

  obtenerUrlMapa(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&hl=es&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openUpgradeModal() {
    this.showUpgradeModal.set(true);
  }

  closeUpgradeModal() {
    this.showUpgradeModal.set(false);
  }

  contactarEquipoTecnico(planSeleccionado: string) {
    console.log(`Iniciando contacto con soporte para adquirir el plan: ${planSeleccionado}`);
    this.closeUpgradeModal();
    alert(`El equipo técnico se pondrá en contacto contigo pronto para activar tu plan ${planSeleccionado}.`);
  }

  abrirEdicion() {
    const clonDatos = JSON.parse(JSON.stringify(this.perfilData()));
    this.editPerfilData.set(clonDatos);
    this.cambiarVista('editar-perfil');
  }

  cancelarEdicion() {
    this.editPerfilData.set(null);
    this.cambiarVista('perfil');
  }

  guardarCambios() {
    const datosActualizados = this.editPerfilData();
    
    // 1. Esto actualiza tu perfil visualmente al instante
    this.perfilData.set(datosActualizados);
    
    // 2. Aquí generas el JSON para mandarlo a tu BBDD en el futuro
    const jsonParaBBDD = JSON.stringify(datosActualizados, null, 2);
    console.log("=== JSON GENERADO PARA BBDD ===");
    console.log(jsonParaBBDD);
    
    // 3. Volvemos al perfil y mostramos el modal de éxito
    this.cambiarVista('perfil');
    this.showSuccessModal.set(true);
    
    // Opcional: El modal se cierra solo después de 2.5 segundos
    setTimeout(() => {
      this.showSuccessModal.set(false);
    }, 2500);
  }

  cerrarSuccessModal() {
    this.showSuccessModal.set(false);
  }
}