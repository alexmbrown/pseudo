import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SelectOption } from '../../../common/interfaces/dynamic-form-data';

@Component({
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {

  @ViewChild(DynamicFormComponent)
  public dynamicForm: DynamicFormComponent;

  public parentForm: FormGroup;
  public values: {[key: string]: any} = {};
  public changeSubjects: {[key: string]: Subject<any>} = {};
  public loading = false;

  constructor(
    public dialog: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private builder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.parentForm = this.builder.group({});
    if (this.data.groups && Array.isArray(this.data.groups) && this.data.groups.length > 0) {
      this.data.groups.forEach(group => {
        if (group.key) {
          group.formGroup = this.builder.group({});
          this.parentForm.addControl(group.key, group.formGroup);
        }
      });
    }
    this.cdr.detectChanges();
  }

  public submit(): void {
    this.dialog.close(this.parentForm.value);
  }

  public setValue(key: string, value: any): void {
    if (this.dynamicForm) {
      this.dynamicForm.setValue(key, value);
    }
    this.values[key] = value;
  }

  public onChange(key: string): Observable<any> {
    const subject = new Subject();
    this.changeSubjects[key] = subject;
    return subject;
  }

  public setOptions(key: string, options: SelectOption[]) {
    this.dynamicForm.setOptions(key, options);
  }

}
