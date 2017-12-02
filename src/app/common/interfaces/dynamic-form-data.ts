import { FormControl, ValidatorFn } from '@angular/forms';

export interface FormValidation {
  validator: ValidatorFn;
  message: string;
  type: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormData {
  key: string;
  placeholder: string;
  defaultValue?: string | number;
  type: 'text' | 'number' | 'boolean' | 'select' | 'password' | 'textarea';
  weight?: number;
  validators?: FormValidation[];
  control?: FormControl;
  options?: SelectOption[];
}
