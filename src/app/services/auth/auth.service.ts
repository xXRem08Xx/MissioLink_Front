import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  email: string;
  role: string[];
  nom: string;
  prenom: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authSubject = new BehaviorSubject<AuthResponse | null>(null);
  public authState = this.authSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    if (token) {
      const authData: AuthResponse = JSON.parse(localStorage.getItem('authData')!);
      this.authSubject.next(authData);
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('authData', JSON.stringify(response));
          this.authSubject.next(response);
        })
      );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh_token = localStorage.getItem('refresh_token');
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/refresh`, { refresh_token })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          localStorage.setItem('authData', JSON.stringify(response));
          this.authSubject.next(response);
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('authData');
    this.authSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user`, data);
  }
  
}
