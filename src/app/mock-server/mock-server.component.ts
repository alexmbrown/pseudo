import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/catch';
import { MockServer } from '../common/models/mock-server.model';
import { AlertDialogComponent } from '../core/components/alert-dialog/alert-dialog.component';
import { ServerService } from '../core/services/server.service';

@Component({
  templateUrl: './mock-server.component.html',
  styleUrls: ['./mock-server.component.scss']
})
export class MockServerComponent implements OnInit {

  public server: MockServer;

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['server_id']) {
        this.server = this.serverService.getServer(params['server_id']);
      }
    });
  }

  public restartServer(): void {
    this.serverService.stopServer(this.server);
    setTimeout(() => this.startServer(), 3000);
  }

  public startServer(): void {
    this.serverService.startServer(this.server, err => {
      if (err) {
        const snackBarRef = this.snack.open(`Error starting ${this.server.name}`, 'VIEW');
        snackBarRef.onAction().subscribe(() => {
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Error Starting Server',
              msg: err.error,
              pre: err.stackTrace
            }
          });
        });
      } else {
        this.snack.open(`Successfully started ${this.server.name} on port ${this.server.port}`);
      }
    });
  }

  public stopServer(): void {
    this.serverService.stopServer(this.server);
  }

}
