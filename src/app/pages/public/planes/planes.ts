import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planes.html',
  styleUrls: ['./planes.scss']
})
export class PlanesComponent {
  
  plans = [
    {
      title: 'Gratis',
      description: 'Empieza hoy sin costo y toma tus primeras reservas.',
      price: '$0',
      period: '/mes',
      isPopular: false,
      featuresTitle: null,
      features: [
        'Perfil personal',
        'Chat multicanal (personal)',
        'Búsqueda de servicios',
        'Pago por comisión'
      ],
      buttonText: 'Comenzar',
      buttonIcon: 'fa-arrow-right',
      buttonStyle: 'outline' // 'outline' | 'solid'
    },
    {
      title: 'Automate Pro',
      description: 'Automatiza con IA tu negocio y vende mucho más.',
      price: '$70.000',
      period: '/mes',
      isPopular: true, // Activa el estilo destacado
      featuresTitle: 'Todo en plan Gratis, más:',
      features: [
        'Embudo de chat automatizado',
        'Asistente virtual con IA',
        'Post venta inteligente',
        'Análisis de ganancias'
      ],
      buttonText: 'Comenzar',
      buttonIcon: 'fa-arrow-right',
      buttonStyle: 'solid'
    },
    {
      title: 'Secretar-IA Premium',
      description: 'Tu propia secretaria virtual con identidad propia.',
      price: '$130.000',
      period: '/mes',
      isPopular: false,
      featuresTitle: 'Todo en Automate Pro, más:',
      features: [
        'Identidad personalizada (IA)',
        'Comandos por voz y texto',
        'Ahorro del 90% de tu tiempo'
      ],
      buttonText: 'Agendar reunión',
      buttonIcon: 'fa-calendar',
      buttonStyle: 'outline'
    },
    {
      title: 'Heavensy Enterprise',
      description: 'Ecosistema empresarial para múltiples identidades.',
      price: '$200.000',
      pricePrefix: 'Desde',
      isPopular: false,
      featuresTitle: null,
      features: [
        'Múltiples profesionales y roles',
        'Gestión de equipos y rubros',
        'Organización inteligente',
        'Soporte prioritario 24/7'
      ],
      buttonText: 'Agendar reunión',
      buttonIcon: 'fa-calendar',
      buttonStyle: 'outline'
    }
  ];
}