import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { finalize } from 'rxjs/operators'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  get isAuthenticated() {
    return !!this.auth.getToken();
  }

  gotoLogin() {
    this.router.navigate(['/auth/login']);
  }

  toPlanes(){
    this.router.navigate(['/public/planes']);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.auth.logout().pipe(
      finalize(() => this.router.navigate(['/']))
    ).subscribe();
  }
}