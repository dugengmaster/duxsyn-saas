import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError, tap } from 'rxjs';
import { AuthServiceBase } from './auth.base';
import { AuthStore } from './auth.store';
import { LoginRequest, LoginResponse } from './auth.model';
import { MOCK_CREDENTIALS, MOCK_USER, MOCK_TOKENS, generateRefreshToken } from 'src/mocks';

/**
 * 認證服務 Mock 實作
 * 用於測試環境或開發時不需要真實後端的情況
 * 
 * 測試帳號：
 * - username: admin
 * - password: admin123
 * 
 * @example
 * // 在測試中使用
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: AuthServiceBase, useClass: AuthMockService }
 *   ]
 * });
 */
@Injectable()
export class AuthMockService implements AuthServiceBase {
  constructor(private authStore: AuthStore) {
  }

  /**
   * 模擬登入
   * 驗證帳號密碼：admin / admin123
   * 延遲 500ms 模擬網路請求
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    // 驗證帳號密碼
    if (
      credentials.username !== MOCK_CREDENTIALS.username ||
      credentials.password !== MOCK_CREDENTIALS.password
    ) {
      return throwError(() => ({
        status: 401,
        error: { detail: 'Invalid credentials' }
      })).pipe(delay(300));
    }

    // 模擬成功登入
    return of({
      access: MOCK_TOKENS.access,
      refresh: MOCK_TOKENS.refresh,
      user: MOCK_USER
    }).pipe(
      delay(500),
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
   * 模擬登出
   * 清除所有認證狀態
   */
  logout(): void {
    this.authStore.clear();
  }

  /**
   * 模擬刷新 Token
   * 返回新的 access token
   */
  refreshToken(): Observable<{ access: string }> {
    return of(generateRefreshToken()).pipe(delay(300));
  }
}