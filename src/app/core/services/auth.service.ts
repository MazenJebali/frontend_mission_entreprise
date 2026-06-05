import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { User, LoginRequest, AuthResponse, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'ftn_token';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService, private router: Router) {
    this.loadUser();
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.api.post<any>('/auth/login', credentials).pipe(
      switchMap(res => {
        const authData = res.data as AuthResponse;
        localStorage.setItem(this.TOKEN_KEY, authData.accessToken);
        return this.api.get<any>('/auth/me').pipe(
          tap(me => {
            const user = (me.data ?? me) as User;
            this.currentUserSubject.next(user);
          })
        );
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUser(): void {
    const token = this.getToken();
    if (token) {
      this.api.get<any>('/auth/me').subscribe({
        next: res => this.currentUserSubject.next((res.data ?? res) as User),
        error: () => { this.logout(); }
      });
    }
  }
}
