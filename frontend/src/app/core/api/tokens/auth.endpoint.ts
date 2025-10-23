import { InjectionToken } from '@angular/core';

export interface AuthEndpoint {
  login: string;
  refresh: string;
  logout: string;
  userInfo: string;
}

export const AUTH_ENDPOINT = new InjectionToken<AuthEndpoint>('AuthEndpoint', {
  providedIn: 'root',
  factory: () => ({
    login: '/auth/login/',
    refresh: '/auth/refresh/',
    logout: '/auth/logout/',
    userInfo: '/auth/userInfo/',
  }),
});