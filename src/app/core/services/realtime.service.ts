import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface LatticeMessage {
  profile_name?: string;
  text?: string | { body?: string };
  body?: string;
  messaging_product?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket: Socket;

  constructor(private authService: AuthService) {
    // Conexión con autenticación por query o headers según doc [cite: 12, 14]
    this.socket = io(environment.socketUrl, {
      transports: ['websocket', 'polling'], // [cite: 9]
      query: {
        token: this.authService.getToken() || ''
      }
    });
  }

  // Escuchar nuevos mensajes 
  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      const handler = (msg: any) => {
        console.log('Mensaje recibido:', msg);
        observer.next(msg);
      };
      this.socket.on('new_message', handler);
      return () => this.socket.off('new_message', handler);
    });
  }

  // Event when a message is saved/persisted on the server
  onMessageSaved(): Observable<any> {
    return new Observable(observer => {
      const handler = (msg: any) => {
        console.log('Mensaje guardado event:', msg);
        observer.next(msg);
      };
      this.socket.on('message_saved', handler);
      return () => this.socket.off('message_saved', handler);
    });
  }
  
  disconnect() {
    if (this.socket) this.socket.disconnect();
  }
}
