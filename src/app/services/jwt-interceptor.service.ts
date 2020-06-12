import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService {

  constructor(private authSvc: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authSvc.getToken();
    const refreshToken = this.authSvc.refreshToken();

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          if (error.url.includes('/login')) {
            return throwError(error);
          }
          if (error.error.error.name === 'InvalidJwtToken' ) {
            this.logout();
          }
          if (error.error.error.name === 'InvalidRefreshToken') {
            this.logout();
          }
          if (error.status === 400) {
            return throwError(error);
          }
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.authSvc.requestCount++;
            if (this.authSvc.requestCount > 3) {
              this.authSvc.requestCount = 0;
              this.logout();
              return throwError(error);
            }
            return this.unauthorized(request, next, refreshToken);
          } else {
            return throwError(error);
          }
        }
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private unauthorized(
    request: HttpRequest<any>,
    next: HttpHandler,
    refreshToken: any
  ): Observable<HttpEvent<any>> {
    return this.authSvc.refreshToken().pipe(
      switchMap(tokenData => {
        this.authSvc.storeTokens(tokenData);
        request = this.addToken(request, tokenData.token);
        return next.handle(request);
      }),
      catchError(error => {
        if (error.error.error.name === 'InvalidRefreshToken'
            || error.error.error.name === 'E_INVALID_JWT_REFRESH_TOKEN') {
          this.logout();
          return next.handle(request);
        }
      })
    );
  }

  private logout() {
    this.authSvc.removeAll()
    this.router.navigate(['/login']);
  }
}
