import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MockServerComponent } from './mock-server/mock-server.component';
import { NewServerComponent } from './new-server/new-server.component';
import { ServerInfoComponent } from './mock-server/server-info/server-info.component';
import { FilesComponent } from './mock-server/files/files.component';
import { LogsComponent } from './mock-server/logs/logs.component';

const routes: Routes = [
  {
    path: 'server/:server_id',
    component: MockServerComponent,
    children: [
      {
        path: 'info',
        component: ServerInfoComponent
      },
      {
        path: 'files',
        component: FilesComponent
      },
      {
        path: 'logs',
        component: LogsComponent
      },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'new',
    component: NewServerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
