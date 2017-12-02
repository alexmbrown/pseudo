import { Component, Input } from '@angular/core';
import { MockServer } from '../common/models/mock-server.model';
import { Router } from '@angular/router';
import { ServerService } from '../core/services/server.service';
import { MatDialog } from '@angular/material';
import { FormDialogComponent } from '../core/components/form-dialog/form-dialog.component';
import { CREATE_MOCK_FORM } from '../common/constants/forms/create-mock-form';

@Component({
  selector: 'psd-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {

  @Input()
  public servers: MockServer[];

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
      const server: MockServer = this.serverService.addServer(result);
      this.router.navigate(['server', server.id]);
    });
  }

}
