import { Validators } from '@angular/forms';
import { FormData } from '../../interfaces/dynamic-form-data';

export const EDIT_FILE_MOCK_FORM: FormData[][] = [
  [
    {
      placeholder: 'File Path',
      key: 'path',
      type: 'text',
      validators: [{
        type: 'required',
        validator: Validators.required,
        message: 'Mock name required'
      }]
    },
    {
      placeholder: 'File Name',
      key: 'name',
      type: 'text',
      validators: [{
        type: 'required',
        validator: Validators.required,
        message: 'Mock name required'
      }]
    }
  ]
];
