import { Routes } from '@angular/router';


import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login', // Se accederá vía /auth/login
    component: LoginComponent
  },
  {
    path: 'registro', // Se accederá vía /auth/registro
    component: RegisterComponent
  },
  {
    // Redirige /auth a /auth/login por defecto
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];