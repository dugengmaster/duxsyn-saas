import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloatingInputComponent, AffixInputComponent } from '@duxsyn/daisy-ng/components/data-input';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FloatingInputComponent, AffixInputComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demo');
}
