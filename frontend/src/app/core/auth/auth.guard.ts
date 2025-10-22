import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

/**
 * 認證路由守衛（函數式）
 * 保護需要登入才能訪問的路由
 * 
 * @example
 * // 在路由設定中使用
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]  // ← 直接用函數
 * }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated) {
    return true;
  }

  // 未登入，重導向到登入頁，並記錄原始 URL
  console.warn('未登入，重導向到登入頁');
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};