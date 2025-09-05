import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // In real app, this would be hashed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [];
  private nextUserId = 1;

  constructor(private router: Router) {
    this.loadUsersFromStorage();
    this.loadCurrentUserFromStorage();
  }

  signup(username: string, email: string, password: string): boolean {
    // Check if user already exists
    if (this.users.find(u => u.email === email || u.username === username)) {
      return false;
    }

    const newUser: User = {
      id: this.nextUserId++,
      username,
      email,
      password // In production, hash this
    };

    this.users.push(newUser);
    this.saveUsersToStorage();
    this.currentUserSubject.next(newUser);
    this.saveCurrentUserToStorage();
    return true;
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      this.saveCurrentUserToStorage();
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private saveUsersToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  private loadUsersFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('users');
      if (stored) {
        this.users = JSON.parse(stored);
        if (this.users.length > 0) {
          this.nextUserId = Math.max(...this.users.map(u => u.id)) + 1;
        }
      }
    }
  }

  private saveCurrentUserToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const user = this.currentUserSubject.value;
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    }
  }

  private loadCurrentUserFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const user = JSON.parse(stored);
        this.currentUserSubject.next(user);
      }
    }
  }
}
