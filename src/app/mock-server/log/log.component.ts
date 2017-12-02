import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MockServer } from '../../common/models/mock-server.model';
import { ServerService } from '../../core/services/server.service';

@Component({
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {

  public server: MockServer;

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.route.parent.params.subscribe((params: Params) => {
      if (params['server_id']) {
        this.server = this.serverService.getServer(params['server_id']);
      }
    });
  }

  public clearAll(): void {
    this.server.clearLogs();
    this.serverService.update(this.server);
  }

}
