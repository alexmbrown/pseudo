import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule, MatSortModule, MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './header/header.component';
import { EndpointComponent } from './mock-server/server-info/endpoint/endpoint.component';
import { LogEntryComponent } from './mock-server/log/log-entry/log-entry.component';
import { LogComponent } from './mock-server/log/log.component';
import { MockServerComponent } from './mock-server/mock-server.component';
import { NewServerComponent } from './new-server/new-server.component';
import { ServerTabComponent } from './side-nav/server-tab/server-tab.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FilesComponent } from './mock-server/files/files.component';
import { ServerInfoComponent } from './mock-server/server-info/server-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EndpointComponent,
    FilesComponent,
    HeaderComponent,
    LogComponent,
    LogEntryComponent,
    MockServerComponent,
    NewServerComponent,
    ServerInfoComponent,
    ServerTabComponent,
    SideNavComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatToolbarModule,
    MatTableModule,
    MatTabsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
