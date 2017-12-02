import { Validators } from '@angular/forms';
import { FormData } from '../../interfaces/dynamic-form-data';
import { PORT_REGEX } from '../regex';
import { CustomValidators } from '../../utils/custom-validators';

export const CREATE_MOCK_FORM: FormData[][] = [
  [
    {
      placeholder: 'Name',
      key: 'name',
      defaultValue: 'New Mock Server',
      type: 'text',
      weight: 2,
      validators: [{
        type: 'required',
        validator: Validators.required,
        message: 'Mock name required'
      }]
    },
    {
      placeholder: 'Port',
      key: 'port',
      defaultValue: 8080,
      type: 'number',
      weight: 1,
      validators: [
        {
          type: 'required',
          validator: Validators.required,
          message: 'Port name required'
        },
        {
          type: 'pattern',
          validator: Validators.pattern(PORT_REGEX),
          message: 'Port number not valid'
        }
      ]
    }
  ], [
    {
      placeholder: 'Public Path',
      key: 'publicPath',
      defaultValue: '/public',
      type: 'text',
      validators: [
        {
          type: 'required',
          validator: Validators.required,
          message: 'Request path required'
        },
        {
          type: 'regex',
          validator: CustomValidators.regex,
          message: 'Path not valid regex'
        }
      ]
    },
  ]
];
