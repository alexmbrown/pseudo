import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import { CREATE_MOCK_FORM } from '../../common/constants/forms/create-mock-form';
import { ENDPOINT_REQUEST_FORM } from '../../common/constants/forms/endpoint-request-form';
import { ENDPOINT_RESPONSE_FORM } from '../../common/constants/forms/endpoint-response-form';
import { FormData } from '../../common/interfaces/dynamic-form-data';
import { Endpoint } from '../../common/models/endpoint.model';
import { MockServer } from '../../common/models/mock-server.model';
import { ConfirmationDialogComponent } from '../../core/components/confirmation-dialog/confirmation-dialog.component';
import { DynamicFormComponent } from '../../core/components/dynamic-form/dynamic-form.component';
import { FormDialogComponent } from '../../core/components/form-dialog/form-dialog.component';
import { ServerService } from '../../core/services/server.service';

@Component({
  templateUrl: './server-info.component.html',
  styleUrls: ['./server-info.component.scss']
})
export class ServerInfoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DynamicFormComponent)
  public formComponent: DynamicFormComponent;

  public form: FormGroup;
  public formData: FormData[][] = CREATE_MOCK_FORM;

  public server: MockServer;

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.form = this.builder.group({});
  }

  public ngAfterViewInit(): void {
    this.route.parent.params.subscribe((params: Params) => {
      if (params['server_id']) {
        this.cdr.detectChanges();
        this.form.reset();
        this.server = this.serverService.getServer(params['server_id']);
        this.formComponent.setValue('name', this.server.name);
        this.formComponent.setValue('port', this.server.port);
        this.formComponent.setValue('publicPath', this.server.publicPath);
        this.cdr.detectChanges();
      }
    });
  }

  public ngOnDestroy(): void {
    this.cdr.detach();
  }

  public delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Server',
        msg: 'Are you sure?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.serverService.deleteServer(this.server);
        const servers: MockServer[] = this.serverService.getServers();
        if (servers.length > 0) {
          this.router.navigate(['server', servers[0].id]);
        } else {
          this.router.navigate(['new']);
        }
      }
    });
  }

  public save(): void {
    this.server.update(this.form.value);
    this.serverService.update(this.server);
  }

  public addEndpoint(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        title: 'Create New Endpoint',
        groups: [
          {
            name: 'REQUEST',
            form: ENDPOINT_REQUEST_FORM
          },
          {
            name: 'RESPONSE',
            form: ENDPOINT_RESPONSE_FORM
          }
        ],
        submitText: 'Create Endpoint'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.server.addEndpoint(new Endpoint(this.server, result));
        this.serverService.update(this.server);
      }
    });
  }

}
