import { Inject, Injectable } from '@angular/core';
import { AUTH_ENDPOINT, AuthEndpoint } from './tokens';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiEndpointService {
  private readonly base = environment.apiUrl;

  constructor(@Inject(AUTH_ENDPOINT) private readonly _auth: AuthEndpoint) {}

  get auth() {
    return this.wrap(this._auth);
  }

  private wrap<T extends Record<string, any>>(obj: T): T {
    const result = {} as T;
    for (const key in obj) {
      const value = obj[key];
      (result as any)[key] =
        typeof value === 'function'
          ? (...args: any[]) => `${this.base}${value(...args)}`
          : typeof value === 'object'
          ? this.wrap(value)
          : `${this.base}${value}`;
    }
    return result;
  }
}
