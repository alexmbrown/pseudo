import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CREATE_MOCK_FORM } from '../common/constants/forms/create-mock-form';
import { MockServer } from '../common/models/mock-server.model';
import { FormDialogComponent } from '../core/components/form-dialog/form-dialog.component';
import { ServerService } from '../core/services/server.service';

@Component({
  templateUrl: './new-server.component.html'
})
export class NewServerComponent {

  constructor(
    private dialog: MatDialog,
    private serverService: ServerService,
    private router: Router
  ) {}

  public openCreateMockDialog(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        title: 'Create New Mock',
        form: CREATE_MOCK_FORM,
        submitText: 'Create Mock'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const server: MockServer = this.serverService.addServer(result);
        this.router.navigate(['server', server.id]);
      }
    });
  }

}
