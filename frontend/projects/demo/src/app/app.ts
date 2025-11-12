import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FloatingInputComponent,
  AffixInputComponent,
} from '@duxsyn/daisy-ng/components/data-input';
import { LoginFormComponent } from './components/login-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginFormComponent],
  template: `
    <div class="flex flex-col md:flex-row h-screen">
      <div class="order-2 md:order-1 md:flex-2 bg-black">左側內容</div>
      <div class="order-1 md:order-2 md:flex-1 min-h-screen flex items-center justify-center"><dux-login-form /></div>
    </div>
    <router-outlet />
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
}
