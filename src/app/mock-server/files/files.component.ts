import { DataSource } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSort } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { dialog } from 'electron';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as uuid from 'uuid/v4';
import { EDIT_FILE_MOCK_FORM } from '../../common/constants/forms/edit-file-form';
import { File } from '../../common/interfaces/file';
import { MockServer } from '../../common/models/mock-server.model';
import { AlertDialogComponent } from '../../core/components/alert-dialog/alert-dialog.component';
import { FormDialogComponent } from '../../core/components/form-dialog/form-dialog.component';
import { ProgressDialogComponent } from '../../core/components/progress-dialog/progress-dialog.component';
import { ServerService } from '../../core/services/server.service';

const remote = (window as any).require('electron').remote;
const openFileDialog: Function = remote.getGlobal('openFileDialog');
const copy: Function = remote.getGlobal('copy');
const viewFiles: Function = remote.getGlobal('viewFiles');
const deleteFile: Function = remote.getGlobal('deleteFile');
const openFile: Function = remote.getGlobal('openFile');

function sortFiles(publicPath: string, change: {active: string, direction: string}) {
  if (change.active && change.direction) {
    const reverse = change.direction === 'asc' ? 1 : -1;
    switch (change.active) {
      case 'extension': return (l: File, r: File) => l.extension.localeCompare(r.extension) * reverse;
      case 'public': return (l: File, r: File) => {
        const pathRegex = new RegExp(publicPath);
        const lp = pathRegex.test(l.path);
        const rp = pathRegex.test(r.path);
        return ((lp === rp) ? 0 : lp ? -1 : 1) * reverse;
      };
      case 'name': return (l: File, r: File) => l.name.localeCompare(r.name) * reverse;
      default: return (l: File, r: File) => l.path.localeCompare(r.path) * reverse;
    }
  }
}

export class FilesDataSource extends DataSource<File> {

  constructor(
    private server: MockServer,
    private sort: MatSort,
  ) {
    super();
  }

  public connect(): Observable<File[]> {
    const changes = [
      this.server.onFilesChange(),
      this.sort.sortChange
    ];

    return Observable
      .merge(...changes)
      .map((change: any) => {
        return this.server.getFiles()
          .sort((l: File, r: File) => l.path.localeCompare(r.path))
          .sort(sortFiles(this.server.publicPath, change));
      });
  }

  public disconnect() {}

}

@Component({
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort)
  public sort: MatSort;

  public server: MockServer;

  public displayedColumns: string[] = ['public', 'path', 'name', 'extension', 'actions'];
  public dataSource: FilesDataSource;

  constructor(
    private serverService: ServerService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.route.parent.params.subscribe((params: Params) => {
      if (params['server_id']) {
        this.server = this.serverService.getServer(params['server_id']);
      }
    });
  }

  public ngAfterViewInit(): void {
    this.dataSource = new FilesDataSource(this.server, this.sort);
    this.cdr.detectChanges();
  }

  public viewFiles(): void {
    viewFiles(this.server.id);
  }

  public openFileDialog(): void {
    openFileDialog({properties: ['openFile', 'multiSelections']}, (files: string[]) => {
      if (files && Array.isArray(files) && files.length > 0) {
        this.copyFiles(files);
      }
    });
  }

  private copyFiles(files: string[]): void {
      const dialogRef = this.dialog.open(ProgressDialogComponent, {
        data: {
          title: 'Copying Files'
        }
      });

      const fileCount: number = files.length;
      const errors: Error[] = [];
      let completeCount = 0;

      Observable
        .from(files)
        .do((file: string) => {
          dialogRef.componentInstance.msg = `Copying ${file}`;
        })
        .flatMap((file: string) =>  this.copyFile(file))
        .subscribe(
          (file) => {
            completeCount ++;
            dialogRef.componentInstance.value = completeCount / fileCount;
          },
          (err: Error) => errors.push(err),
          () => {
            if (errors.length > 0) {
              // open alert with errors
            }
            dialogRef.close();
          }
        );
  }

  private copyFile(file: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      const id = uuid();
      copy(this.server.id, id, file, (err: Error, fileName: string) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(fileName);
          const index = fileName.lastIndexOf('.');
          this.server.addFile({
            id,
            name: fileName.substr(0, index),
            path: '/',
            extension: fileName.substr(index + 1)
          });
          this.serverService.update(this.server);
        }
      });
    });
  }

  public deleteFile(file: File) {
    deleteFile(this.server.id, file.id, file.extension, (err: Error) => {
      if (err) {
        const snackBarRef = this.snack.open(`Error deleting ${file.name}.${file.extension}`, 'VIEW');
        snackBarRef.onAction().subscribe(() => {
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Error Deleting File',
              msg: err.message,
              pre: err.stack
            }
          });
        });
      } else {
        this.server.deleteFile(file.id);
        this.serverService.update(this.server);
        this.snack.open(`Successfully deleted  ${file.name}.${file.extension}`);
      }
    });
  }

  public editFile(file: File) {
    const dialogRef: MatDialogRef<FormDialogComponent> = this.dialog.open(FormDialogComponent, {
      data: {
        title: 'Edit File',
        form: EDIT_FILE_MOCK_FORM,
        submitText: 'Save',
        update: true
      }
    });

    dialogRef.componentInstance.setValue('path', file.path);
    dialogRef.componentInstance.setValue('name', file.name);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        file.path = result.path;
        file.name = result.name;
        this.server.updateFile(file);
        this.serverService.update(this.server);
      }
    });
  }

  public openFile(file: File) {
    openFile(this.server.id, file.id, file.extension);
  }

}
