import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './progress-dialog.component.html'
})
export class ProgressDialogComponent {

  public msg: string;
  public value: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {}

}
