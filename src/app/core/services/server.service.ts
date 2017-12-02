import { Injectable } from '@angular/core';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/switchMap';
import { MockServer } from '../../common/models/mock-server.model';
import { LocalStorageService } from './local-storage.service';

const remote = (window as any).require('electron').remote;
const bootstrapServer: any = remote.getGlobal('bootstrapServer');

const STORAGE_KEY = 'server_info';

@Injectable()
export class ServerService {

  private servers: MockServer[];

  constructor(private localStorage: LocalStorageService) {
    this.servers = localStorage.getObj(STORAGE_KEY) as MockServer[] || [];
    this.servers = this.servers.map((server: object) => new MockServer(server));

    this.servers.forEach((server: MockServer) => server.onLogEvent().subscribe(() => {
      this.storeServers();
    }));
  }

  public addServer(data: any): MockServer {
    const server: MockServer = new MockServer(data);
    this.servers.push(server);
    this.storeServers();
    return server;
  }

  public deleteServer(id: string): void {
    const index = this.servers.findIndex((server: MockServer) => server.id === id);
    if (index >= 0) {
      this.servers.splice(index, 1);
    }
    this.storeServers();
  }

  public getServer(id: string): MockServer {
    return this.servers.find((server: MockServer) => server.id === id);
  }

  public getServers(): MockServer[] {
    return this.servers.sort((l: MockServer, r: MockServer) => l.name.localeCompare(r.name));
  }

  private storeServers(): void {
    this.localStorage.set(STORAGE_KEY, this.servers.map((server: MockServer) => server.serialize()));
  }

  public update(server: MockServer) {
    this.deleteServer(server.id);
    this.servers.push(server);
    this.storeServers();
  }

  public startServer(server: MockServer, cb: (err: any, success: boolean) => void): void {
    server.setStarting(true);
    bootstrapServer(server.id, server.port, (err, success) => {
      server.setStarting(false);
      if (err || !success) {
        cb(err, false);
      } else {
        server.start();
        server.pushConfig();
      }
    });
  }

  public stopServer(server: MockServer): void {
    server.stop();
  }

}
