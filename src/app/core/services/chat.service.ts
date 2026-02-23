import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);

  // Helper para obtener la URL base sin el '/api' al final, 
  // ya que el endpoint de mensajes está en la raíz /{company_id}/...
  private get baseUrl() {
    return environment.apiUrl.replace(/\/api$/, '');
  }

  getConversaciones() {
    return this.http.get<any>(`${environment.apiUrl}/conversations`);
  }

  getMensajesDe(telefono: string) {
    return this.http.get<any>(`${environment.apiUrl}/conversations/${telefono}`);
  }

  // NUEVO MÉTODO PARA ENVIAR 
enviarMensaje(telefono: string, texto: string, companyId: string = 'LATTICE_001') {
    // Usamos environment.apiUrl directamente para que la URL final sea:
    // https://heavensy-api-backend.onrender.com/api/LATTICE_001/messages/send
    const url = `${environment.apiUrl}/${companyId}/messages/send`;
    
    const body = {
      to: telefono,
      message: texto,
      type: 'text'
    };
    return this.http.post(url, body);
  }
}