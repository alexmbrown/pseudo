import { Component, Input, OnInit } from '@angular/core';
import { MockServer } from '../../common/models/mock-server.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { ServerService } from '../../core/services/server.service';

@Component({
  selector: 'psd-server-tab',
  templateUrl: './server-tab.component.html',
  styleUrls: ['./server-tab.component.scss']
})
export class ServerTabComponent {

  @Input()
  public server: MockServer;

  constructor(public serverService: ServerService) {}

}
