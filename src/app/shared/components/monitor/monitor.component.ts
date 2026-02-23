import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RealtimeService, LatticeMessage } from '../../../core/services';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="monitor-container">
      <div class="header-section">
        <h2>📨 Monitor de Mensajes en Tiempo Real</h2>
        <div class="connection-status">
          <span class="status-indicator connected"></span>
          <span class="status-text">Conectado</span>
        </div>
      </div>
      
      <div class="messages-list">
        <div *ngIf="messages.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>Esperando mensajes...</h3>
          <p>Los mensajes aparecerán aquí en tiempo real</p>
        </div>
        
        <div *ngFor="let msg of messages; let i = index" class="message-item" [attr.data-index]="i">
          <div class="message-header">
            <strong class="contact-name">{{ msg.profile_name || 'Contacto desconocido' }}</strong>
            <span class="message-time">{{ formatTime(msg['timestamp']) }}</span>
          </div>
          <div class="message-body">
            {{ extractText(msg) }}
          </div>
          <div class="message-meta">
            <span class="badge badge-{{ msg['messaging_product'] }}">{{ msg['messaging_product'] }}</span>
            <span class="badge badge-{{ msg['type'] }}">{{ msg['type'] }}</span>
          </div>
        </div>
      </div>
      
      <div class="footer-info" *ngIf="messages.length > 0">
        <small>{{ messages.length }} mensaje(s) | Últimos 50 mostrados</small>
      </div>
    </div>
  `,
  styles: [`
    .monitor-container {
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(0, 120, 215, 0.2);
    }

    h2 {
      margin: 0;
      color: #1a1a1a;
      font-size: 1.8rem;
      font-weight: 600;
      letter-spacing: -0.5px;
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(37, 211, 102, 0.1);
      border-radius: 20px;
      border: 1px solid #25d366;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-indicator.connected {
      background: #25d366;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .status-text {
      font-size: 0.85rem;
      color: #25d366;
      font-weight: 600;
    }

    .messages-list {
      flex: 1;
      overflow-y: auto;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      background: white;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .messages-list::-webkit-scrollbar {
      width: 8px;
    }

    .messages-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .messages-list::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    .messages-list::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      text-align: center;
      gap: 1rem;
    }

    .empty-icon {
      font-size: 4rem;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0;
      color: #666;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .empty-state p {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
    }

    .message-item {
      border-left: 4px solid #0078d7;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 6px;
      transition: all 0.2s ease;
      animation: slideIn 0.3s ease-out;
    }

    .message-item:hover {
      background: #f0f4f8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      gap: 1rem;
    }

    .contact-name {
      color: #0078d7;
      font-size: 1rem;
      font-weight: 600;
      flex: 1;
      word-break: break-word;
    }

    .message-time {
      font-size: 0.8rem;
      color: #b0b0b0;
      white-space: nowrap;
      font-weight: 500;
    }

    .message-body {
      color: #333;
      margin: 0.75rem 0;
      line-height: 1.6;
      word-break: break-word;
      font-size: 0.95rem;
    }

    .message-meta {
      margin-top: 0.75rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      display: inline-block;
      padding: 0.3rem 0.6rem;
      border-radius: 14px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-whatsapp {
      background: #25d366;
      color: white;
    }

    .badge-messenger {
      background: #0084ff;
      color: white;
    }

    .badge-instagram {
      background: #e1306c;
      color: white;
    }

    .badge-unknown {
      background: #999;
      color: white;
    }

    .badge-text {
      background: #0078d7;
      color: white;
    }

    .badge-image {
      background: #ff7b54;
      color: white;
    }

    .badge-button {
      background: #9c27b0;
      color: white;
    }

    .badge-interactive {
      background: #4caf50;
      color: white;
    }

    .footer-info {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
      text-align: right;
      color: #999;
      font-size: 0.85rem;
    }
  `]
})
export class MonitorComponent implements OnInit, OnDestroy {
  messages: LatticeMessage[] = [];
  private subs: Subscription[] = [];
  private realtime = inject(RealtimeService);

  ngOnInit() {
    // Suscripción a mensajes nuevos
    this.subs.push(
      this.realtime.onNewMessage().subscribe((msg: LatticeMessage) => {
        console.log('Nuevo mensaje:', msg);
        this.messages.unshift(msg);
        // Mantener solo los últimos 50 mensajes
        if (this.messages.length > 50) {
          this.messages.pop();
        }
      })
    );

    // Suscripción a mensajes guardados
    this.subs.push(
      this.realtime.onMessageSaved().subscribe((msg: LatticeMessage) => {
        console.log('Guardado en MongoDB:', msg);
      })
    );
  }

  extractText(msg: LatticeMessage): string {
    if (typeof msg.text === 'string') return msg.text;
    if (msg.text && typeof msg.text === 'object' && 'body' in msg.text) {
      return (msg.text as { body: string }).body;
    }
    return msg.body || msg['message'] || '(sin texto)';
  }

  formatTime(timestamp: string): string {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'N/A';
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.realtime.disconnect();
  }
}
