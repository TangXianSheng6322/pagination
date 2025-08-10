import { Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  private sessionTimeoutMs = 24 * 60 * 60 * 1000;
  private logoutTimer?: ReturnType<typeof setTimeout>;

  updateLastActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
    this.startSessionTimeout();
  }

  private startSessionTimeout() {
    this.clearSessionTimeout();

    const lastActivityStr = localStorage.getItem('lastActivity');
    if (!lastActivityStr) {
      this.logout();
      return;
    }

    const lastActivity =
      Number(localStorage.getItem('lastActivity')) || Date.now();
    const remainingTime = this.sessionTimeoutMs - (Date.now() - lastActivity);
    if (remainingTime <= 0) {
      this.logout();
      alert('Session expired after 24 hours of inactivity');
      return;
    }

    this.logoutTimer = setTimeout(() => {
      this.logout();
      alert(
        'Session has expired after 24 hours of inactivity. Please log in again',
      );
    }, remainingTime);
  }
  private clearSessionTimeout() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = undefined;
    }
  }

  constructor(
    private auth: Auth,
    private router: Router,
  ) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser.set(user);
      this.isLoggedIn.set(!!user);

      if (user) {
        this.startSessionTimeout();
      } else {
        this.clearSessionTimeout();
      }
    });
  }

  register(email: string, passsword: string): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, passsword),
    ).pipe(
      tap(({ user }) => {
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
        this.updateLastActivity();
      }),
      switchMap(({ user }) => of(user)),
    );
  }

  login(email: string, passsword: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, passsword)).pipe(
      tap(({ user }) => {
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
        this.updateLastActivity();
      }),
      switchMap(({ user }) => of(user)),
    );
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.currentUser.set(null);
      this.isLoggedIn.set(false);
      this.clearSessionTimeout();
      this.router.navigate(['./login']);
    });
  }
}
