import { Component } from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div style="padding: 40px; text-align: center;">
      <h1>歡迎，{{ (authStore.currentUser$ | async)?.username }}！</h1>
      <p>您已成功登入</p>
      <button (click)="logout()">登出</button>
    </div>
  `,
  styles: [`
    button {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background: #5568d3;
    }
  `]
})
export class HomeComponent {
  constructor(
    public authStore: AuthStore,
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}