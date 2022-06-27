import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, BehaviorSubject, ReplaySubject, distinctUntilChanged } from 'rxjs';

export interface User {
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser$: Observable<User | undefined>;
  public isAuthenticated$: Observable<boolean>;

  public isAuthenticated = false;

  private currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {
    this.currentUser$ = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  checkAuth() {
    // If JWT detected, attempt to get & store user's info
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.http.get('/api/auth/profile')
        .subscribe({
          next: (user) => {
            this.setAuth(user as User);
          },
          error: (err) => {
            console.error(err);
            this.purgeAuth();
          }
        });
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: User, token?: string) {
    console.log('setting auth', user);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
    this.isAuthenticated = true;
    if (token) {
      // Save JWT sent from server in localstorage

      this.saveToken(token);
    }
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next(undefined);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }
}
