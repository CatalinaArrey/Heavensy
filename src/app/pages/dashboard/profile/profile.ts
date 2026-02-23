import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  usuario = {
    nombre: 'Juan Pérez',
    rut: '12.345.678-9',
    profesion: 'Consultor Financiero',
    plan: 'Plan Pro',
    verificado: true,
    // Usamos una imagen de mujer como en el ejemplo, o mantenemos UI avatars
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=740&t=st=1706123456~exp=1706124056~hmac=example', 
    detalles: {
      nombreCompleto: 'Juan Antonio Pérez González',
      email: 'juan.perez@example.cl',
      telefono: '+56 9 1234 5678',
      fechaNac: '15 de Enero, 1985'
    },
    profesional: {
      titulo: 'Consultor Financiero & Estratégico',
      descripcion: 'Especialista en planificación financiera para pequeñas y medianas empresas. Ayudo a optimizar flujos de caja y estructurar planes de crecimiento sostenible.',
      categoria: 'Legal y Finanzas',
      web: 'www.juanperezfinanzas.cl'
    }
  };
}