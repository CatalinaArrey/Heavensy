import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './pages/dashboard/profile/profile';

export const routes: Routes = [
  
  // --- Rutas de Autenticación (se cargan primero) ---
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes')
                         .then(m => m.AUTH_ROUTES)
  },

  // --- RUTAS DEL DASHBOARD (Esta es la importante) ---
  {
    path: 'dashboard', // Dashboard moved to /dashboard so root can be public
    component: MainLayoutComponent,
    canActivate: [authGuard], // Require authentication
    loadChildren: () => import('./pages/dashboard/dashboard.routes')
                         .then(m => m.DASHBOARD_ROUTES)
  },

  // --- RUTA DE PERFIL ---
  {
    path: 'profile',
    component: MainLayoutComponent, // Mantiene el sidebar y header
    canActivate: [authGuard],        // Requiere estar logueado
    children: [
      {
        path: '',
        component: ProfileComponent
      }
    ]
  },


  // --- Rutas Públicas ---
  {
    path: '', // root serves the public pages (home)
    loadChildren: () => import('./pages/public/public.routes')
                         .then(m => m.PUBLIC_ROUTES)
  },
  
  // --- Ruta 'Catch-All' (Redirección) ---
  {
    path: '**',
    redirectTo: '', // Redirige a la raíz (que ahora es el dashboard)
    pathMatch: 'full'
  }
];