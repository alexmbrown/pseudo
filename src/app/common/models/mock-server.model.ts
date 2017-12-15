import * as uuid from 'uuid/v4';
import { Endpoint } from './endpoint.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LogEntry } from '../interfaces/log-entry';
import { Subject } from 'rxjs/Subject';
import { File } from '../interfaces/file';
import { Dependency } from '../interfaces/dependency';

declare const io: any;

export class MockServer {

  private logEvent: Subject<void> = new Subject<void>();
  private filesSubject: BehaviorSubject<File[]> = new BehaviorSubject<File[]>(null);
  private dependenciesSubject: BehaviorSubject<Dependency[]> = new BehaviorSubject<Dependency[]>(null);

  private socket;
  private connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public id: string;
  public name: string;
  public port: number;
  public publicPath: string;
  private endpoints: Endpoint[] = [];
  private logEntries: LogEntry[] = [];
  private files: File[] = [];
  private dependencies: Dependency[] = [];

  private starting = false;

  constructor(obj: any) {
    this.id = obj.id || uuid();
    this.name = obj.name || 'New Mock Server';
    this.port = obj.port || 8080;
    this.publicPath = obj.publicPath;

    if (obj.endpoints && Array.isArray(obj.endpoints)) {
      this.endpoints = obj.endpoints.map(o => new Endpoint(this, o));
    }

    if (obj.logEntries && Array.isArray(obj.logEntries)) {
      this.logEntries = obj.logEntries;
    }

    if (obj.files && Array.isArray(obj.files)) {
      this.files = obj.files;
      this.filesSubject.next(this.files);
    }

    if (obj.dependencies && Array.isArray(obj.dependencies)) {
      this.dependencies = obj.dependencies;
      this.dependenciesSubject.next(this.dependencies);
    }

    this.socket = io(`http://localhost:${this.port}`);

    this.socket.on('log', (entry: LogEntry) => {
      this.logEntries.push(entry);
      if (this.logEntries.length > 100) {
        this.logEntries.shift();
      }
      this.logEvent.next();
    });

    this.socket.on('connect', () => this.connected.next(true));
    this.socket.on('disconnect', () => this.connected.next(false));
    this.socket.on('reconnect', () => this.connected.next(true));
  }

  public update(obj: any): void {
    this.name = obj.name;
    this.port = obj.port;
    this.publicPath = obj.publicPath;
    this.pushConfig();
  }

  public addEndpoint(endpoint: Endpoint): void {
    this.endpoints.push(endpoint);
    this.pushConfig();
  }

  public removeEndpoint(id: string): void {
    const index = this.endpoints.findIndex((endpoint: Endpoint) => endpoint.id === id);
    if (index >= 0) {
      this.endpoints.splice(index, 1);
      this.pushConfig();
    }
  }

  public getEndpoints(): Endpoint[] {
    return this.endpoints;
  }

  public serialize(): object {
    return {
      id: this.id,
      name: this.name,
      port: this.port,
      publicPath: this.publicPath,
      endpoints: this.getEndpoints().map((endpoint: Endpoint) => {
        return {
          id: endpoint.id,
          method: endpoint.method,
          path: endpoint.path,
          auth: endpoint.auth,
          status: endpoint.status,
          responseType: endpoint.responseType,
          body: endpoint.body
        };
      }),
      logEntries: this.logEntries,
      files: this.files,
      dependencies: this.dependencies
    };
  }

  public isConnected(): Observable<boolean> {
    return this.connected;
  }

  public onLogEvent(): Observable<void> {
    return this.logEvent;
  }

  public getLogEntries(): LogEntry[] {
    return this.logEntries.sort((l: LogEntry, r: LogEntry) => (new Date(r.timestamp) as any) - (new Date(l.timestamp) as any));
  }

  public addFile(file: File): void {
    this.files.push(file);
    this.filesSubject.next(this.files);
    this.pushConfig();
  }

  public getFiles(): File[] {
    return this.files;
  }

  public onFilesChange(): Observable<File[]> {
    return this.filesSubject;
  }

  public deleteFile(fileId: string): void {
    const index = this.files.findIndex((file: File) => file.id === fileId);
    if (index >= 0) {
      this.files.splice(index, 1);
      this.filesSubject.next(this.files);
      this.pushConfig();
    }
  }

  public updateFile(file: File): void {
    const index = this.files.findIndex((f: File) => f.id === file.id);
    if (index >= 0) {
      this.files[index] = file;
      this.filesSubject.next(this.files);
      this.pushConfig();
    }
  }

  public start(): void {
    this.connected.next(true);
  }

  public stop(): void {
    this.connected.next(false);
    this.socket.emit('server stop');
  }

  public pushConfig(): void {
    this.connected.subscribe((connected: boolean) => {
      if (connected) {
        this.socket.emit('config update', this.serialize());
      }
    });
  }

  public setStarting(starting: boolean): void {
    this.starting = starting;
  }

  public isStarting(): boolean {
    return this.starting;
  }

  public clearLogs(): void {
    this.logEntries = [];
  }

  public addDependency(dependency: Dependency): void {
    this.dependencies.push(dependency);
    this.dependenciesSubject.next(this.dependencies);
    this.pushConfig();
  }

  public removeDependency(name: string): void {
    const index = this.dependencies.findIndex((dependency: Dependency) => dependency.name === name);
    if (index >= 0) {
      this.endpoints.splice(index, 1);
      this.pushConfig();
    }
  }

  public getDependencies(): Dependency[] {
    return this.dependencies.sort((l: Dependency, r: Dependency) => l.name.localeCompare(r.name));
  }

  public onDependenciesChange(): Observable<Dependency[]> {
    return this.dependenciesSubject;
  }

}
