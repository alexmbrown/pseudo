import { Validators } from '@angular/forms';
import { FormData } from '../../interfaces/dynamic-form-data';

export const ENDPOINT_RESPONSE_FORM: FormData[][] = [
  [
    {
      placeholder: 'Status',
      key: 'status',
      defaultValue: '200',
      type: 'number',
      weight: 1,
      validators: [
        {
          type: 'required',
          validator: Validators.required,
          message: 'Status is required'
        },
        {
          type: 'pattern',
          validator: Validators.pattern(/^[1-5][0-9][0-9]$/),
          message: 'Status not valid'
        }
      ]
    },
    {
      placeholder: 'Response Type',
      key: 'responseType',
      defaultValue: 'NONE',
      type: 'select',
      options: [
        {label: 'None', value: 'NONE'},
        {label: 'Dynamic (JavaScript)', value: 'DYNAMIC'},
        {label: 'JSON', value: 'JSON'},
        {label: 'Plain Text', value: 'TEXT'},
        {label: 'XML', value: 'XML'},
      ],
      weight: 1
    }
  ]
];

