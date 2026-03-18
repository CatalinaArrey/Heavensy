import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Importamos HttpClient
import { BehaviorSubject, Observable } from 'rxjs';

export type PlanType = 'gratis' | 'automate-pro' | 'secretar-ia' | 'enterprise';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  // Inyectamos el cliente HTTP para hacer peticiones al backend
  private http = inject(HttpClient); 

  // Cambia esta URL por la ruta real de tu backend (Node, Firebase, PHP, etc.)
  private apiUrl = 'https://tu-api.com/v1/registro'; 

  private planSubject = new BehaviorSubject<PlanType>('gratis');
  public plan$ = this.planSubject.asObservable();

  setPlan(plan: PlanType) {
    this.planSubject.next(plan);
  }

  getPlan(): PlanType {
    return this.planSubject.value;
  }

  getStepsForPlan(plan: PlanType): number {
    switch (plan) {
      case 'gratis':
        return 1;
      case 'automate-pro':
        return 2;
      case 'secretar-ia':
        return 3;
      case 'enterprise':
        return 4;
      default:
        return 1;
    }
  }

  // ---> NUEVO MÉTODO HTTP <---
  // Recibe los datos del formulario de registro y los envía al backend
  registrarUsuario(datosFormulario: any): Observable<any> {
    const payload = {
      ...datosFormulario,           // Los datos que llenó el usuario (nombre, email, etc)
      planSeleccionado: this.getPlan() // El plan que traemos guardado en memoria
    };
    
    // Hacemos la petición POST al servidor
    return this.http.post(this.apiUrl, payload);
  }
}