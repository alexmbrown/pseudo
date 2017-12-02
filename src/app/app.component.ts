import { Component, OnInit } from '@angular/core';
import { ServerService } from './core/services/server.service';
import { Router } from '@angular/router';
import { MockServer } from './common/models/mock-server.model';

@Component({
  selector: 'psd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public sideNavOpen = true;

  constructor(
    private router: Router,
    public serverService: ServerService
  ) {}

  public ngOnInit(): void {
    const servers: MockServer[] = this.serverService.getServers();
    if (servers.length > 0) {
      this.router.navigate(['server', servers[0].id]);
    } else {
      this.router.navigate(['new']);
    }
  }


  public onSideNavToggle(): void {
    this.sideNavOpen = !this.sideNavOpen;
  }

  public sideNavClosed(): void {
    this.sideNavOpen = false;
  }

}
