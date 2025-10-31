import { Component, computed, input, model } from '@angular/core';

import { InputType, InputSize } from './data-input.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'daisy-affix-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="input validator" [class]="sizeClass()">
      @if (prefix()) {
      <span class="label">{{ prefix() }}</span>
      }
      <input type="url" name="text" [(ngModel)]="value" [placeholder]="placeholder()" />
      @if (suffix()) {
      <span class="label">{{ suffix() }}</span>
      }
      <div class="validator-hint">TEST</div>
    </label>
  `,
})
export class AffixInputComponent {
  prefix = input<string>('');
  suffix = input<string>('');

  value = model<string>('');
  placeholder = input<string>('');

  size = input<InputSize>('md');
  sizeClass = computed(() => `input-${this.size()}`);

  required = input(false, {
    transform: (v: boolean | string) => {
      return v === '';
    },
  });
}

