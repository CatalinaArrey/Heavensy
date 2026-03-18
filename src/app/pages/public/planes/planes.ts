import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../core/services'; 

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planes.html',
  styleUrls: ['./planes.scss']
})
export class PlanesComponent {
  
  constructor(
    private router: Router, 
    private registrationService: RegistrationService
  ) {}

  selectPlan(plan: any) {
    // Cambia aquí los nombres permitidos según tu PlanType real
    let planId: 'gratis' | 'automate-pro' | 'secretar-ia' | 'enterprise' = 'gratis'; 
    
    switch(plan.title) {
      case 'Gratis': 
        planId = 'gratis'; 
        break;
      case 'Automate Pro': 
        planId = 'automate-pro'; 
        break;
      case 'Secretar-IA Premium': 
        planId = 'secretar-ia'; 
        break;
      case 'Heavensy Enterprise': 
        planId = 'enterprise'; 
        break;
    }

    this.registrationService.setPlan(planId);
    this.router.navigate(['/auth/register']);
  }
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
      buttonStyle: 'outline' 
    },
    {
      title: 'Automate Pro',
      description: 'Automatiza con IA tu negocio y vende mucho más.',
      price: '$70.000',
      period: '/mes',
      isPopular: true,
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
      buttonText: 'Seleccionar plan', // Cambié el texto para que tenga sentido con el registro
      buttonIcon: 'fa-arrow-right',
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
      buttonText: 'Seleccionar plan', // Cambié el texto para que tenga sentido con el registro
      buttonIcon: 'fa-arrow-right',
      buttonStyle: 'outline'
    }
  ];
}