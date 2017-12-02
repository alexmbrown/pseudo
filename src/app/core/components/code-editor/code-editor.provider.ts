import { forwardRef, Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CodeEditorComponent } from './code-editor.component';

export const CODE_EDITOR_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CodeEditorComponent),
  multi: true
};
