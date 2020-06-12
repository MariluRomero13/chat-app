import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { IAuth } from './../models/auth';
import { IToken } from './../models/token';
import { tap, mapTo, catchError } from 'rxjs/operators';
import { IUser } from './../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  requestCount = 0;
  constructor(private http: HttpClient) { }
  login(user: IAuth): Observable<any> {
    return this.http.post<any>(`${environment.endPoint}/login`, user).pipe(
      tap((token: any) => {
        this.storeTokens(token);
      }),
      mapTo(200),
      catchError(error => {
        return of(error);
      })
    );
  }

  refreshToken() {
    return this.http.post<any>(`${environment.endPoint}/login/refresh-token`, {
      refresh_token: this.getRefreshToken()
    }).pipe(tap((token: any) => {
      this.storeTokens(token);
    }));
  }

  logout() {
    return this.http.post<any>(`${environment.endPoint}/logout`, {
      refresh_token: this.getRefreshToken()
    }).pipe(
      tap(() => this.removeAll()),
      mapTo(200),
      catchError(error => {
        return of(error);
      }));
  }

  registerUser(user: IUser): Observable<any> {
    return this.http.post<any>(`${environment.endPoint}/register`, user);
  }

  storeTokens(token: any) {
    localStorage.setItem('token', token.token.token);
    localStorage.setItem('refresh_token', token.token.refreshToken);
    localStorage.setItem('user', JSON.stringify(token.user));
    localStorage.setItem('is_logged', '1');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  removeAll() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
