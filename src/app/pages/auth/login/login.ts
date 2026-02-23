import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  private router = inject(Router);
  private auth = inject(AuthService);

  onSubmit() {
    this.error = null;
    if (!this.email || !this.password) {
      this.error = 'Ingresa email y contraseña';
      return;
    }
    this.loading = true;
    this.auth.login({ username: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/chat']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Credenciales inválidas';
      }
    });
  }

  registerComponent() {
    this.router.navigate(['/auth/registro']);
  }
}