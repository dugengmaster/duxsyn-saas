import { Component, computed, input, model, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputType, InputSize } from './data-input.types';

/**
 * Floating Label Component
 * Implementation based on DaisyUI's Floating Label
 *
 * @example
 * ```html
 * <daisy-floating-label
 *   label="Email"
 *   type="email"
 *   [(value)]="email"
 *   placeholder="Enter your email"
 *   [required]="true"
 * />
 * ```
 */
@Component({
  selector: 'daisy-floating-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="floating-label">
      <span>{{ label() }}</span>
      <input
        [type]="type()"
        [name]="finalName()"
        [attr.autocomplete]="autoAutocomplete()"
        [(ngModel)]="value"
        [placeholder]="placeholder()"
        class="input validator"
        [class]="sizeClass()"
        [required]="required()"
      />
      <div class="validator-hint">{{ validatorHint() }}</div>
    </label>
  `,
})
export class FloatingInputComponent {
  // Required properties
  label = input<string>();

  // Functional properties
  type = input<InputType>('text');
  name = input<string>('');

  finalName = computed(
    () => this.name() || this.label()?.toLowerCase().replace(/\s+/g, '-') || 'input'
  );

  autocomplete = input<string>('');
  value = model<string>('');
  placeholder = input<string>('');

  // Style properties
  size = input<InputSize>('md');

  // Validation properties
  required = input(false, {
    transform: (v: boolean | string) => {
      return v === '';
    },
  });

  validatorHint = input<string>('');

  // Computed Classes
  sizeClass = computed(() => `input-${this.size()}`);
  autoAutocomplete = computed(() => {
    if (this.autocomplete()) return this.autocomplete();

    const map: Record<string, string> = {
      email: 'email',
      password: 'current-password',
      tel: 'tel',
      url: 'url',
    };
    return map[this.type()] || 'off';
  });

  constructor() {}
}