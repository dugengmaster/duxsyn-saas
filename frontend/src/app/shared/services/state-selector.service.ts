import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

/**
 * 通用狀態選擇器
 * 用於從 Observable 狀態中選擇特定屬性
 *
 * @example
 * // 選擇單一屬性
 * selector.select(user$, 'username')
 *
 * @example
 * // 選擇多個屬性
 * selector.selectMany(user$, 'username', 'email')
 *
 */
@Injectable({
  providedIn: 'root',
})
export class StateSelectorService {
  select<T, K extends keyof T>(
    state$: Observable<T>,
    key: K
  ): Observable<T[K]> {
    return state$.pipe(
      map((s) => s[key]),
      distinctUntilChanged()
    );
  }
  selectMany<T, K extends keyof T>(
    state$: Observable<T>,
    ...keys: K[]
  ): Observable<Pick<T, K>> {
    return state$.pipe(
      map((s) => {
        const result = {} as Pick<T, K>;
        keys.forEach((key) => (result[key] = s[key]));
        return result;
      }),
      distinctUntilChanged((prev, curr) =>
        keys.every((key) => prev[key] === curr[key])
      )
    );
  }
}
