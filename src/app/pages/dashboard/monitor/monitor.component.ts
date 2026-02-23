import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorComponent } from '../../../shared/components/monitor/monitor.component';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [CommonModule, MonitorComponent],
  template: `
    <div class="monitor-page">
      <app-monitor></app-monitor>
    </div>
  `,
  styles: [`
    .monitor-page {
      padding: 2rem;
      height: 100%;
      background: #f8f9fa;
    }
  `]
})
export class MonitorPageComponent {}
