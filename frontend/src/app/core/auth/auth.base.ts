import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, AuthTokens } from './auth.model';

export abstract class AuthServiceBase {
  abstract login(credentials: LoginRequest): Observable<LoginResponse>;
  abstract logout(): void;
  abstract refreshToken(): Observable<{ access: string }>;
}