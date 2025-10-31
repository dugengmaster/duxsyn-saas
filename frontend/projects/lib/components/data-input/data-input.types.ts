/**
 * Data Input - Shared Types
 * Common type definitions for all data input components
 */

// ===== Basic Types =====

/**
 * Input type options
 * Supported HTML input types for form inputs
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

/**
 * Input size options (DaisyUI sizes)
 */
export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variants for DaisyUI components
 */
export type ColorVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

// ===== Composed Property Types =====

/**
 * Base input properties
 * Can be reused across different input components
 */
export type BaseInputProps = {
  type: InputType;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
};

/**
 * Validation properties
 * Can be applied to any form component
 */
export type ValidationProps = {
  required: boolean;
  error: boolean;
  errorText: string;
};

/**
 * DaisyUI style properties
 * Common styling options for DaisyUI input components
 */
export type DaisyUIInputStyleProps = {
  size: InputSize;
  bordered: boolean;
  color?: ColorVariant;
};