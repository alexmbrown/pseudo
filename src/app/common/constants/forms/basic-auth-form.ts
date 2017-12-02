import { Validators } from '@angular/forms';
import { FormData } from '../../interfaces/dynamic-form-data';

export const BASIC_AUTH_FORM: FormData[][] = [
  [
    {
      placeholder: 'Username',
      key: 'username',
      type: 'text',
      weight: 1,
      validators: [
        {
          type: 'required',
          validator: Validators.required,
          message: 'Request path required'
        }
      ]
    },
    {
      placeholder: 'Password',
      key: 'password',
      type: 'password',
      weight: 1,
      validators: [
        {
          type: 'required',
          validator: Validators.required,
          message: 'Request path required'
        }
      ]
    },
  ]
];
