import { Component, forwardRef, Input, OnChanges, OnInit, Provider, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

declare const ace: any;

const VALUE_ACCESSOR_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CodeEditorComponent),
  multi: true
};

const VALIDATORS_PROVIDER: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CodeEditorComponent),
  multi: true,
};

@Component({
  selector: 'psd-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  providers: [
    VALUE_ACCESSOR_PROVIDER,
    VALIDATORS_PROVIDER
  ]
})
export class CodeEditorComponent implements OnInit, ControlValueAccessor, OnChanges, Validator {

  @Input()
  public disabled = false;

  @ViewChild('editor')
  public container;

  @Input()
  public language: string;

  private editor;
  private silent = false;

  public ngOnInit(): void {
    this.editor = ace.edit(this.container.nativeElement);
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode(`ace/mode/${this.language}`);
    this.editor.setOptions({
      minLines: 4,
      maxLines: Infinity
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.editor && changes.hasOwnProperty('language')) {
      this.editor.getSession().setMode(`ace/mode/${changes['language'].currentValue}`);
    }
  }

  public writeValue(obj: any): void {
    this.silent = true;
    this.editor.setValue(obj || '');
    this.silent = false;
  }

  public registerOnChange(fn: any): void {
    this.editor.getSession().on('change', () => {
      if (!this.silent) {
        fn(this.editor.getValue());
      }
    });
  }

  public registerOnTouched(fn: any): void {
    this.editor.getSession().on('blue', fn);
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(c: AbstractControl): {[key: string]: any} {
    if (this.hasValidationErrors()) {
      return {syntax: {valid: false}};
    }
    return null;
  }

  public registerOnValidatorChange?(fn: () => void): void {
    this.editor.getSession().on('changeAnnotation', fn);
  }

  private hasValidationErrors(): boolean {
    const annotations = this.editor.getSession().getAnnotations();
    let flag = false;
    annotations.forEach(annotation => {
      if (annotation.type === 'error') {
        flag = true;
      }
    });
    return flag;
  }

}
