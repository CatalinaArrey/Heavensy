import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { firstValueFrom, catchError, of } from 'rxjs';
import { defaultCredentials } from '../environments/environment';
import { environmentFlags } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Provide HttpClient providers for standalone components/services
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};

// Auto-login initializer: uses default credentials when no token present (development convenience)
export function initAuthFactory(auth: AuthService) {
  return () => {
    try {
      const token = auth.getToken();
      if (token) return Promise.resolve();
      const creds = { username: defaultCredentials.username, password: defaultCredentials.password };
      return firstValueFrom(auth.login(creds).pipe(catchError(() => of(null))));
    } catch (e) {
      return Promise.resolve();
    }
  };
}

// Append the initializer provider
// Only enable auto-login initializer when explicitly allowed by environment flags
if (environmentFlags && environmentFlags.autoLogin) {
  appConfig.providers!.push({
    provide: APP_INITIALIZER,
    useFactory: initAuthFactory,
    deps: [AuthService],
    multi: true
  });
}
