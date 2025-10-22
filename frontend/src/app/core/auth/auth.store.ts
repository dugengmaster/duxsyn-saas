import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthTokens } from './auth.model';

/**
 * 認證狀態管理服務
 * 使用 BehaviorSubject 管理使用者認證狀態、Token 和使用者資訊
 * 並自動同步至 localStorage
 * 
 * @example
 * // 在組件中訂閱認證狀態
 * constructor(private authStore: AuthStore) {
 *   this.authStore.isAuthenticated$.subscribe(isAuth => {
 *     console.log('使用者登入狀態:', isAuth);
 *   });
 * }
 * 
 * @example
 * // 讀取當前狀態
 * if (this.authStore.isAuthenticated) {
 *   console.log('當前使用者:', this.authStore.currentUser);
 *   console.log('Access Token:', this.authStore.accessToken);
 * }
 * 
 * @example
 * // 設定登入狀態（通常在 AuthService 中呼叫）
 * this.authStore.setTokens({ access: 'xxx', refresh: 'yyy' });
 * this.authStore.setUser({ id: 1, username: 'john' });
 * 
 * @example
 * // 登出清除狀態
 * this.authStore.clear();
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  /** 當前使用者狀態 (內部) */
  private currentUserSubject: BehaviorSubject<User | null>;
  
  /** JWT Token 狀態 (內部) */
  private tokensSubject: BehaviorSubject<AuthTokens | null>;
  
  /** 認證狀態 (內部) */
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  /** 當前使用者 Observable */
  public currentUser$: Observable<User | null>;
  
  /** JWT Token Observable */
  public authTokens$: Observable<AuthTokens | null>;
  
  /** 認證狀態 Observable */
  public isAuthenticated$: Observable<boolean>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.tokensSubject = new BehaviorSubject<AuthTokens | null>(null);
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    this.currentUser$ = this.currentUserSubject.asObservable();
    this.authTokens$ = this.tokensSubject.asObservable();
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    this.loadFromStorage();
  }

  /**
   * 取得當前使用者
   * @returns 當前使用者物件，未登入則回傳 null
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * 取得當前 Token
   * @returns Token 物件，未登入則回傳 null
   */
  get tokens(): AuthTokens | null {
    return this.tokensSubject.value;
  }

  /**
   * 取得認證狀態
   * @returns 是否已認證
   */
  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * 取得 Access Token
   * @returns Access Token 字串，未登入則回傳 null
   */
  get accessToken(): string | null {
    return this.tokens?.access || null;
  }

  /**
   * 設定使用者資訊並同步至 localStorage
   * @param user - 使用者物件，登出時傳入 null
   */
  setUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  /**
   * 設定 JWT Token 並同步至 localStorage
   * @param tokens - Token 物件，登出時傳入 null
   */
  setTokens(tokens: AuthTokens | null): void {
    this.tokensSubject.next(tokens);
    this.isAuthenticatedSubject.next(!!tokens);

    if (tokens) {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  /**
   * 清除所有認證狀態和 localStorage 資料
   */
  clear(): void {
    this.currentUserSubject.next(null);
    this.tokensSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.clear();
  }

  /**
   * 從 localStorage 載入認證狀態
   * 在初始化時自動執行
   * @private
   */
  private loadFromStorage(): void {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userJson = localStorage.getItem('user');

    if (accessToken && refreshToken) {
      this.setTokens({ access: accessToken, refresh: refreshToken });
    }

    if (userJson) {
      this.setUser(JSON.parse(userJson));
    }
  }
}