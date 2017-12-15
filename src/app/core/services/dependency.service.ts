import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

const remote = (window as any).require('electron').remote;
const shell: any = remote.getGlobal('shell');
const getFilePath: any = remote.getGlobal('getFilePath');
const readFile: any = remote.getGlobal('readFile');

@Injectable()
export class DependencyService {

  public getPackage(module: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      console.log('npm show before', module);
      shell.exec(`npm show ${module} --json`, {silent: true}, (code: number, stdout: string, stderr: string) => {
        console.log('npm show after');
        if (code === 0) {
          observer.next(JSON.parse(stdout));
        } else {
          observer.error(stderr);
        }
      });
    });
  }

  public getInstalledVersion(serverId: string, module: string): string {
    const file: string = readFile(getFilePath(serverId, 'node_modules', module, 'package.json'));
    if (file) {
      return JSON.parse(file).version;
    }
  }

  public installDependency(serverId: string, module: string, version?: string): Observable<void> {
    this.navigateToDirectory(serverId);
    return new Observable((observer: Observer<void>) => {
      shell.exec(`npm i ${module}@${version || 'latest'}`, {silent: false}, (code: number, stdout: string, stderr: string) => {
        if (code === 0) {
          observer.next(undefined);
        } else {
          observer.error(stderr);
        }
      });
    });
  }

  private navigateToDirectory(serverId: string): void {
    if (shell.echo(process.cwd()) !== getFilePath(serverId)) {
      shell.cd(getFilePath(serverId));
    }
  }

  public removeDependency(serverId: string, module: string): Observable<void> {
    this.navigateToDirectory(serverId);
    return new Observable((observer: Observer<void>) => {
      shell.exec(`npm uninstall ${module}`, {silent: false}, (code: number, stdout: string, stderr: string) => {
        if (code === 0) {
          observer.next(undefined);
        } else {
          observer.error(stderr);
        }
      });
    });
  }

}
