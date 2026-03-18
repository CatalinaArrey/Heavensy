import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faWandMagicSparkles, faUserTie, faIdBadge, faUser, faWallet, 
  faTicket, faArrowRight, faCircleCheck, faQrcode, faFile, 
  faPenToSquare, faCheck, faTrash, faEye, faEyeSlash,
  faCamera, faVideo 
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { RegistrationService, PlanType } from '../../../core/services';

const DEFAULT_PROFILE_IMG = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {

  private registrationService = inject(RegistrationService);
  private router = inject(Router);
  private http = inject(HttpClient);

  // JSON Iterativo donde se guardará la info paso a paso
  registrationPayload: any = {};

  bancos: Array<{codigo:string; nombre:string}> = []; 

  currentStep = 1;
  planType: PlanType = 'gratis';
  totalSteps = 3; 
  isManualEntryEnabled = true; 
  selectedFileName: string | null = null;

  showPassword = false;
  showConfirmPassword = false;
  strengthScore = 0;
  reqs = {
    length: false,
    upper: false,
    lower: false,
    numberSpecial: false
  };

  // Paso 2
  charCount = 0;
  maxChars = 160;

  // Iconos
  public faWand = faWandMagicSparkles;
  public faUserTie = faUserTie;
  public faId = faIdBadge;
  public faUser = faUser;
  public faWallet = faWallet;
  public faTicket = faTicket;
  public faArrowRight = faArrowRight;
  public faCheckCircle = faCircleCheck;
  public faQrcode = faQrcode;
  public faFile = faFile;
  public faPenToSquare = faPenToSquare;
  public faCheck = faCheck;
  public faTrash = faTrash;
  public faEye = faEye;
  public faEyeSlash = faEyeSlash;
  public faCamera = faCamera; 
  public faVideo = faVideo;   

  constructor(library: FaIconLibrary) {
    library.addIcons(faWandMagicSparkles, faUserTie, faIdBadge, faUser, faWallet, faTicket, faArrowRight, faCircleCheck, faQrcode, faFile, faPenToSquare, faCheck, faTrash, faEye, faEyeSlash, faCamera, faVideo);
  }

  ngOnInit() {
    this.planType = this.registrationService.getPlan();
    
    this.totalSteps = 3;

    this.http.get<{ pais: string; instituciones: Array<{ codigo: string; nombre: string }> }>('/assets/data/bancos.json')
      .subscribe(resp => {
        this.bancos = resp.instituciones;
        if (!this.step1Form.get('bank')?.value && this.bancos.length) {
          this.step1Form.get('bank')?.setValue(this.bancos[0].codigo);
        }
      });

    this.toggleEntryMode(this.isManualEntryEnabled);

    this.step1Form.get('fullName')?.valueChanges.subscribe(value => {
      this.previewData.name = value ? value : 'Margarita Gonzalez';
    });

    this.step1Form.get('password')?.valueChanges.subscribe(value => {
      const val = value || '';
      this.reqs.length = val.length >= 8;
      this.reqs.upper = /[A-Z]/.test(val);
      this.reqs.lower = /[a-z]/.test(val);
      this.reqs.numberSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(val);
      this.strengthScore = Object.values(this.reqs).filter(Boolean).length;
    });

    this.step2Form.get('presentation')?.valueChanges.subscribe(val => {
      this.charCount = val ? val.length : 0;
    });
  }
  
  step1Form = new FormGroup({
    fullName: new FormControl(''),
    rut: new FormControl(''),
    birthDate: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[9][0-9]{8}$')]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    bank: new FormControl('', [Validators.required]),
    accountType: new FormControl('rut', [Validators.required]),
    accountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    referral: new FormControl('')
  }, { validators: passwordMatchValidator });

  step2Form = new FormGroup({
    slogan: new FormControl(''),
    presentation: new FormControl('', [Validators.maxLength(160)])
  });

  step3Form = new FormGroup({
    company: new FormControl('', [Validators.required]),
    employees: new FormControl('', [Validators.required]),
    role: new FormControl(''),
    additionalInfo: new FormControl('')
  });

  previewData = {
    name: 'Margarita Gonzalez',
    role: 'Podóloga Clínica',
    id: 'HV-2024-MARG',
    img: DEFAULT_PROFILE_IMG
  };

  toggleEntryMode(isManual: boolean) {
    this.isManualEntryEnabled = isManual;

    if (isManual) {
      this.step1Form.get('fullName')?.setValidators([Validators.required]);
      this.step1Form.get('rut')?.setValidators([Validators.required, Validators.maxLength(12)]);
      this.step1Form.get('birthDate')?.setValidators([Validators.required]);
    } else {
      ['fullName', 'rut', 'birthDate'].forEach(controlName => {
        this.step1Form.get(controlName)?.clearValidators();
      });
    }
    
    ['fullName', 'rut', 'birthDate'].forEach(controlName => {
      this.step1Form.get(controlName)?.updateValueAndValidity();
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          this.previewData.img = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onMediaSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(`Archivo cargado para el item ${index}:`, input.files[0].name);
    }
  }

  removeImage(event: Event, fileInput: HTMLInputElement) {
    event.stopPropagation(); 
    this.selectedFileName = null;
    this.previewData.img = DEFAULT_PROFILE_IMG;
    fileInput.value = ''; 
  }

  onSubmit() {
    const currentForm = this.getCurrentForm();
    
    // ======== BLOQUE DE DEPURACIÓN ========
    console.log('--- INTENTO DE ENVÍO ---');
    console.log('¿Formulario Válido?:', currentForm.valid);
    console.log('Fuerza de la contraseña (Debe ser 4):', this.strengthScore);
    
    // Esto te dirá exactamente qué campo tiene el error
    Object.keys(currentForm.controls).forEach(key => {
      const controlErrors = currentForm.get(key)?.errors;
      if (controlErrors != null) {
        console.log(`Error en el campo [${key}]:`, controlErrors);
      }
    });
    
    // Revisa si el error es a nivel de todo el formulario (ej: contraseñas no coinciden)
    if (currentForm.errors) {
      console.log('Error general del formulario:', currentForm.errors);
    }
    // ======================================

    if (currentForm.valid && (this.currentStep !== 1 || this.strengthScore === 4)) {
      
      // Guardado iterativo
      if (this.currentStep === 1) {
        this.registrationPayload.personalInfo = this.step1Form.value;
      } else if (this.currentStep === 2) {
        this.registrationPayload.media = this.step2Form.value;
        this.registrationPayload.profileImage = this.previewData.img;
      } else if (this.currentStep === 3) {
        this.registrationPayload.companyInfo = this.step3Form.value;
      }

      // Avance o finalización
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        this.completeRegistration();
      }
    } else {
      // Marca todos los campos como "tocados" para que se pongan rojos los que faltan
      currentForm.markAllAsTouched();
      console.warn('El formulario no avanzó porque tiene errores. Revisa los mensajes arriba.');
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getCurrentForm(): FormGroup {
    switch (this.currentStep) {
      case 1: return this.step1Form;
      case 2: return this.step2Form;
      case 3: return this.step3Form;
      default: return this.step1Form;
    }
  }

  completeRegistration() {
    this.registrationPayload.planType = this.planType;
    if (this.isManualEntryEnabled && this.step1Form.value.fullName) {
        this.previewData.name = this.step1Form.value.fullName;
    }

    console.log('--- ENVIANDO JSON FINAL AL SERVIDOR ---');
    console.log(JSON.stringify(this.registrationPayload, null, 2));
    
    localStorage.setItem('heavency_registration_data', JSON.stringify(this.registrationPayload));

    this.registrationService.registrarUsuario(this.registrationPayload).subscribe({
      next: (respuestaBackend) => {
        console.log('Registro exitoso:', respuestaBackend);
        alert('¡Te has registrado con éxito!');
        // this.router.navigate(['/dashboard']); 
      },
      error: (errorBackend) => {
        console.error('Hubo un error al registrar:', errorBackend);
        alert('Ocurrió un error al intentar conectarse al servidor.');
      }
    });
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}