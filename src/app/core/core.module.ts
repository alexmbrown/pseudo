import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule,
  MatProgressBarModule,
  MatSelectModule
} from '@angular/material';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { FormDialogComponent } from './components/form-dialog/form-dialog.component';
import { PanelChildComponent, PanelComponent } from './components/panel/panel.component';
import { ProgressDialogComponent } from './components/progress-dialog/progress-dialog.component';
import { StopClickDirective } from './directives/stop-click.directive';
import { StatusPipe } from './pipes/status.pipe';
import { LocalStorageService } from './services/local-storage.service';
import { ServerService } from './services/server.service';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { DependencyService } from './services/dependency.service';

@NgModule({
  declarations: [
    AlertDialogComponent,
    CodeEditorComponent,
    ConfirmationDialogComponent,
    DynamicFormComponent,
    FormDialogComponent,
    PanelComponent,
    PanelChildComponent,
    ProgressDialogComponent,
    StatusPipe,
    StopClickDirective
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmationDialogComponent,
    FormDialogComponent,
    ProgressDialogComponent,
  ],
  exports: [
    AlertDialogComponent,
    CodeEditorComponent,
    ConfirmationDialogComponent,
    DynamicFormComponent,
    FormDialogComponent,
    PanelComponent,
    PanelChildComponent,
    ProgressDialogComponent,
    StatusPipe,
    StopClickDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule
  ],
  providers: [
    DependencyService,
    LocalStorageService,
    ServerService
  ]
})
export class CoreModule {}
