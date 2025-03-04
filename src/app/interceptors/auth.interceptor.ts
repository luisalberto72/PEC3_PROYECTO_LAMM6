import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { EcolodgeService } from '../services/ecolodge.service'; // Asegúrate de importar tu servicio de autenticación
import { catchError } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: EcolodgeService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token');

    if (token && this.authService.isTokenExpired(token)) {
      return this.authService.refreshToken().pipe(
        switchMap((newToken: any) => {
          localStorage.setItem('token', newToken.access_token);

          // Clonar la petición con el nuevo token actualizado
          const clonedRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken.access_token}` }
          });

          return next.handle(clonedRequest);
        }),
        catchError(error => {
          console.error('Error al refrescar el token:', error);
          this.authService.logout(); // Si el refresh falla, cerrar sesión
          return throwError(() => error);
        })
      );
    }

    // Si el token no ha expirado, continuar con la petición normal
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}
