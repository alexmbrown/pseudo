import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data) {}

}
