import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [], 
  templateUrl: './icon.html',
  styleUrls: ['./icon.scss']
})
export class IconComponent {
  @Input() name: string = '';

  @Input()
  @HostBinding('style.width.px')
  @HostBinding('style.height.px')
  size: number = 24; 
}