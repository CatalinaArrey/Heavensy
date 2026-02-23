import { Component, output, signal, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [CommonModule, PickerComponent],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmojiPickerComponent {
  // Estado reactivo para abrir/cerrar
  showPicker = signal(false);

  // Evento para el componente padre
  onEmojiSelect = output<any>();

  constructor(private eRef: ElementRef) {}

  togglePicker() {
    this.showPicker.update(v => !v);
  }

  addEmoji(event: any) {
    this.onEmojiSelect.emit(event.emoji);
    this.showPicker.set(false);
  }

  // Cerrar al hacer clic fuera del componente
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showPicker.set(false);
    }
  }
}