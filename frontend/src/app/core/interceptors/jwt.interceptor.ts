import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthStore, AuthService } from '../auth';

/**
 * JWT Token Interceptor
 * 自動在每個 HTTP 請求加上 Authorization header
 * 並處理 401 錯誤（token 過期時嘗試刷新）
 * 
**/
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /** 是否正在刷新 token */
  private isRefreshing = false;

  constructor(
    private authStore: AuthStore,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * 攔截 HTTP 請求
   * @param request - 原始請求
   * @param next - 下一個處理器
   * @returns Observable<HttpEvent<any>>
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 如果是登入或刷新 token 的請求，不加 token
    if (this.isAuthRequest(request.url)) {
      return next.handle(request);
    }

    // 加上 Authorization header
    const modifiedRequest = this.addToken(request);

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // 處理 401 錯誤（未授權）
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  /**
   * 在請求上加上 JWT token
   * @param request - 原始請求
   * @returns 修改後的請求
   * @private
   */
  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authStore.accessToken;

    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return request;
  }

  /**
   * 處理 401 錯誤，嘗試刷新 token
   * @param request - 原始請求
   * @param next - 下一個處理器
   * @returns Observable<HttpEvent<any>>
   * @private
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;

    return this.authService.refreshToken().pipe(
      switchMap(() => {
        this.isRefreshing = false;
        // Token 刷新成功，重試原請求
        return next.handle(this.addToken(request));
      }),
      catchError((error) => {
        this.isRefreshing = false;
        // Token 刷新失敗，登出並跳轉到登入頁
        console.error('Token refresh failed', error);
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * 檢查是否為認證相關的請求（不需要加 token）
   * @param url - 請求 URL
   * @returns 是否為認證請求
   * @private
   */
  private isAuthRequest(url: string): boolean {
    return url.includes('/api/token/') || url.includes('/api/token/refresh/');
  }
}