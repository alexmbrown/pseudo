import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormData, FormValidation, SelectOption } from '../../../common/interfaces/dynamic-form-data';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

function transformValidation(formData: FormData) {
  if (formData.validators) {
    return formData.validators.map((validation: FormValidation) => validation.validator);
  }
}

@Component({
  selector: 'psd-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {

  @Input()
  public data: FormData[][];

  @Input('form')
  public form: FormGroup;

  @Input('values')
  public values: {[key: string]: any};

  @Input('changes')
  public changes: {[key: string]: Subject<any>};


  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    if (this.data) {
      // build form controls
      this.data.forEach((row: FormData[]) => {
        row.forEach((formData: FormData) => {
          formData.control = new FormControl(this.getValue(formData), transformValidation(formData));
          this.form.addControl(formData.key, formData.control);
          if (this.changes && this.changes.hasOwnProperty(formData.key)) {
            formData.control.valueChanges.subscribe(value => this.changes[formData.key].next(value));
          }
        });
      });
    }
    this.cdr.detectChanges();
  }

  public setValue(key: string, value: any): void {
    if (this.form.controls[key]) {
      this.form.controls[key].setValue(value);
    }
  }

  public onChange(key: string): Observable<any> {
    return this.form.controls[key].valueChanges;
  }

  public getValue(formData: FormData): any {
    if (this.values && this.values.hasOwnProperty(formData.key)) {
      return this.values[formData.key];
    }
    return formData.defaultValue || '';
  }

  public onValueChange(key: string): Observable<any> {
    const control: FormControl = this.form.controls[key] as FormControl;
    if (control) {
      return control.valueChanges;
    }
    return null;
  }

  public setOptions(key: string, options: SelectOption[]): void {
    this.iterate((data: FormData) => {
      if (key === data.key) {
        data.control.setValue('');
        data.options = options;
      }
    });
  }

  private iterate(cb: (data: FormData) => void): void {
    this.data.forEach((row: FormData[]) => {
      row.forEach((data: FormData) => cb(data));
    });
  }

}
