import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  private addAuthHeader(req: HttpRequest<any>) {
    const token = this.auth.getToken();
    if (token) {
      return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return req;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = this.addAuthHeader(req);
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // If 401, try refreshing token once (but avoid refreshing while calling refresh endpoint)
        if (err.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
          return this.auth.refresh().pipe(
            switchMap((res) => {
              const newReq = this.addAuthHeader(req);
              return next.handle(newReq);
            }),
            catchError((refreshErr) => {
              // Refresh failed -> log out
              try { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); } catch (e) {}
              return throwError(() => refreshErr);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }
}
