import { Validators } from '@angular/forms';
import { FormData } from '../../interfaces/dynamic-form-data';
import { CustomValidators } from '../../utils/custom-validators';

export const ENDPOINT_REQUEST_FORM: FormData[][] = [
  [
    {
      placeholder: 'Method',
      key: 'method',
      defaultValue: 'GET',
      type: 'select',
      options: [
        {label: 'Get', value: 'GET'},
        {label: 'Put', value: 'PUT'},
        {label: 'Post', value: 'POST'},
        {label: 'Patch', value: 'PATCH'},
        {label: 'Delete', value: 'DELETE'},
        {label: 'Options', value: 'OPTIONS'},
        {label: 'Head', value: 'HEAD'},
      ],
      weight: 1
    },
    {
      placeholder: 'Path',
      key: 'path',
      defaultValue: '/mock',
      type: 'text',
      weight: 3,
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
    {
      placeholder: 'Auth',
      key: 'auth',
      defaultValue: 'NONE',
      type: 'select',
      weight: 1,
      options: [
        {label: 'No Auth', value: 'NONE'},
        {label: 'Basic Auth', value: 'BASIC'},
        {label: 'Digest Auth', value: 'DIGEST'},
        {label: 'OAuth 1.0', value: 'OAUTH1'},
        {label: 'OAuth 2.0', value: 'OAUTH2'},
        {label: 'Microsoft NTLM', value: 'NTLM'},
        {label: 'AWS IAM v4', value: 'AWS'},
        {label: 'Bearer Token', value: 'BEARER'},
        {label: 'Hawk', value: 'HAWK'},
        {label: 'Atlassian ASAP', value: 'ATLASAP'},
        {label: 'Netrc File', value: 'NETRC'},
      ]
    }
  ]
];

