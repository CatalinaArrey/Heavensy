import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenKey = 'access_token';

  // POST /api/auth/login -> { access_token }
  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
          }
        }
      })
    );
  }

  // Verify token validity
  verify(): Observable<any> {
    const token = this.getToken();
    if (!token) return of(null);
    return this.http.get<any>(`${environment.apiUrl}/auth/verify`);
  }

  // Refresh access token: POST /api/auth/refresh -> { access_token, refresh_token? }
  refresh() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return of(null);
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh`, { refresh_token: refreshToken }).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
          }
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => localStorage.removeItem(this.tokenKey))
    );
  }
}