import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthStore } from './auth.store';
import { LoginRequest, LoginResponse } from './auth.model';

/**
 * 認證服務
 * 負責呼叫後端 API 進行登入、登出、Token 刷新等操作
 * 並透過 AuthStore 更新狀態
 * 
 * @example
 * // 登入
 * this.authService.login({ username: 'user', password: 'pass' })
 *   .subscribe({
 *     next: () => this.router.navigate(['/dashboard']),
 *     error: (err) => console.error('登入失敗', err)
 *   });
 * 
 * @example
 * // 登出
 * this.authService.logout();
 * this.router.navigate(['/login']);
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private authStore: AuthStore
  ) {}

  /**
   * 使用者登入
   * @param credentials - 登入憑證（帳號密碼）
   * @returns Observable<LoginResponse>
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/token/`, credentials)
      .pipe(
        tap(response => {
          // 儲存 tokens
          this.authStore.setTokens({
            access: response.access,
            refresh: response.refresh
          });
          // 儲存使用者資訊
          if (response.user) {
            this.authStore.setUser(response.user);
          }
        })
      );
  }

  /**
   * 使用者登出
   * 清除所有認證狀態
   */
  logout(): void {
    this.authStore.clear();
  }

  /**
   * 刷新 Access Token
   * @returns Observable<{ access: string }>
   */
  refreshToken(): Observable<{ access: string }> {
    const refreshToken = this.authStore.tokens?.refresh;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<{ access: string }>(
      `${this.API_URL}/token/refresh/`,
      { refresh: refreshToken }
    ).pipe(
      tap(response => {
        // 更新 access token
        const currentTokens = this.authStore.tokens;
        if (currentTokens) {
          this.authStore.setTokens({
            access: response.access,
            refresh: currentTokens.refresh
          });
        }
      })
    );
  }
}