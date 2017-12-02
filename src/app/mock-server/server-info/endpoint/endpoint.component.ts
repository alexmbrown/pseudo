import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatExpansionPanel } from '@angular/material';
import { ENDPOINT_REQUEST_FORM } from '../../../common/constants/forms/endpoint-request-form';
import { ENDPOINT_RESPONSE_FORM } from '../../../common/constants/forms/endpoint-response-form';
import { FormData } from '../../../common/interfaces/dynamic-form-data';
import { Endpoint } from '../../../common/models/endpoint.model';
import { ConfirmationDialogComponent } from '../../../core/components/confirmation-dialog/confirmation-dialog.component';
import { ServerService } from '../../../core/services/server.service';
import { DynamicFormComponent } from '../../../core/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'psd-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.scss']
})
export class EndpointComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatExpansionPanel)
  public expansionPanel: MatExpansionPanel;

  @ViewChild('request')
  public requestFormComponent: DynamicFormComponent;

  @ViewChild('response')
  public responseFormComponent: DynamicFormComponent;

  @Input()
  public endpoint: Endpoint;

  public language: string;

  public parentForm: FormGroup;
  public requestForm: FormGroup;
  public responseForm: FormGroup;
  public endpointRequestFormData: FormData[][] = ENDPOINT_REQUEST_FORM;
  public endpointResponseFormData: FormData[][] = ENDPOINT_RESPONSE_FORM;

  public body: FormControl;

  constructor(
    private dialog: MatDialog,
    private builder: FormBuilder,
    private serverService: ServerService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.requestForm = this.builder.group({});
    this.responseForm = this.builder.group({});
    this.body = new FormControl(this.endpoint.body);
    this.responseForm.addControl('body', this.body);
    this.parentForm = this.builder.group({
      request: this.requestForm,
      response: this.responseForm,
    });

    this.language = this.getLanguage(this.endpoint.responseType);
  }

  public ngAfterViewInit(): void {
    // set values in form
    this.cdr.detectChanges();
    this.parentForm.reset();
    this.requestFormComponent.setValue('method', this.endpoint.method);
    this.requestFormComponent.setValue('path', this.endpoint.path);
    this.requestFormComponent.setValue('auth', this.endpoint.auth);
    this.responseFormComponent.setValue('status', this.endpoint.status);
    this.responseFormComponent.setValue('responseType', this.endpoint.responseType);
    this.responseFormComponent.setValue('body', this.endpoint.body);
    this.cdr.detectChanges();

    this.responseFormComponent.onValueChange('responseType').subscribe((value: string) => {
      this.language = this.getLanguage(value);
    });
  }

  public ngOnDestroy(): void {
    this.cdr.detach();
  }

  public delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Endpoint',
        msg: 'Are you sure?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.endpoint.parent.removeEndpoint(this.endpoint.id);
        this.serverService.update(this.endpoint.parent);
      }
    });
  }

  public save(): void {
    this.endpoint.update(this.requestForm.value);
    this.endpoint.update(this.responseForm.value);
    this.endpoint.parent.pushConfig();
    this.serverService.update(this.endpoint.parent);
    this.parentForm.markAsPristine();
  }

  public getLanguage(responseType: string): string {
    switch (responseType.toUpperCase()) {
      case 'DYNAMIC': return 'javascript';
      case 'JSON': return 'json';
      case 'XML': return 'xml';
      case 'TEXT': return 'text';
    }
  }

}
