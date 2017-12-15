import { Validators } from '@angular/forms';
import { FormData } from '../../interfaces/dynamic-form-data';

export const ADD_DEPENDENCY_FORM: FormData[][] = [
  [
    {
      placeholder: 'Module Name',
      key: 'name',
      type: 'text',
      weight: 2,
      validators: [
        {
          type: 'required',
          validator: Validators.required,
          message: 'Mock name required'
        }
      ]
    },
    {
      placeholder: 'Version',
      key: 'version',
      defaultValue: 'latest',
      type: 'select',
      weight: 1,
      validators: [
        {
          type: 'required',
          validator: Validators.required,
          message: 'Mock name required'
        }
      ]
    }
  ]
];
