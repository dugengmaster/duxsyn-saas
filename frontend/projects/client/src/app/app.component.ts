import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent],
  template: `<page-login /><router-outlet />`,
})
export class App {
  protected readonly title = signal('client');
}
