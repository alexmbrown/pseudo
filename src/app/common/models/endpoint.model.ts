import * as uuid from 'uuid/v4';
import { MockServer } from './mock-server.model';

export class Endpoint {

  public parent: MockServer;
  public id: string;
  // request
  public method: string;
  public path: string;
  public auth: string;
  // response
  public status: number;
  public responseType: string;
  public body: string;

  constructor(parent: MockServer, data: any) {
    this.parent = parent;
    this.id = data.id || uuid();
    this.method = data.method;
    this.path = data.path;
    this.auth = data.auth;
    this.status = data.status;
    this.responseType = data.responseType;
    this.body = data.body;
  }

  public update(obj: any): void {
    if (obj.path) {
      this.path = obj.path;
    }
    if (obj.method) {
      this.method = obj.method;
    }
    if (obj.auth) {
      this.auth = obj.auth;
    }
    if (obj.status) {
      this.status = obj.status;
    }
    if (obj.responseType) {
      this.responseType = obj.responseType;
    }
    if (obj.body) {
      this.body = obj.body;
    }
  }

}
