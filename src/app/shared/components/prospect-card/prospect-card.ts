import { Component, Input } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common'; 
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-prospect-card',
  standalone: true,
  imports: [CommonModule, NgClass, IconComponent], 
  templateUrl: './prospect-card.html',
  styleUrls: ['./prospect-card.scss']
})
export class ProspectCardComponent {
  @Input() prospecto: any;

  avatarFallback(name?: string) {
    const initials = (name || '').split(' ').filter(Boolean).slice(0,2).map(n => n[0].toUpperCase()).join('') || '?';
    const bg = '#E0E0E0';
    const fg = '#6B7280';
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dy='.35em' font-family='Arial, Helvetica, sans-serif' font-size='16' text-anchor='middle' fill='${fg}'>${initials}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  onAvatarError(event: any, name?: string) {
    try {
      event.target.src = this.avatarFallback(name);
    } catch (e) {
      // ignore
    }
  }
}