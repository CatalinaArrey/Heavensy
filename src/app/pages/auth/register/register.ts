import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faWandMagicSparkles, faUserTie, faIdBadge, faUser, faWallet, faTicket, faArrowRight, faCircleCheck, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {

  // FontAwesome icon references for the template
  public faWand = faWandMagicSparkles;
  public faUserTie = faUserTie;
  public faId = faIdBadge;
  public faUser = faUser;
  public faWallet = faWallet;
  public faTicket = faTicket;
  public faArrowRight = faArrowRight;
  public faCheck = faCircleCheck;
  public faQrcode = faQrcode;

  constructor(library: FaIconLibrary, private router: Router) {
    library.addIcons(faWandMagicSparkles, faUserTie, faIdBadge, faUser, faWallet, faTicket, faArrowRight, faCircleCheck, faQrcode);
  }
  
  // Formulario reactivo agrupado
  registerForm = new FormGroup({
    personal: new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    }),
    banking: new FormGroup({
      bank: new FormControl('banco_estado'),
      accountType: new FormControl('rut'),
      accountNumber: new FormControl('')
    }),
    referral: new FormControl('') // Código de invitado
  });

  // Datos simulados para la vista previa (se mostrarán si el input está vacío)
  previewData = {
    name: 'Margarita Gonzalez',
    role: 'Podóloga Clínica',
    id: 'HV-2024-MARG',
    img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  };

onSubmit() {
    if (this.registerForm.valid) {
      console.log('Datos enviados:', this.registerForm.value);
      
      // 3. Redirigir a la vista principal
      // Asegúrate de que esta ruta exista en tu app.routes.ts
      this.router.navigate(['/dashboard']); 
      
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}