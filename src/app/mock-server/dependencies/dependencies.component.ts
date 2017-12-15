import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DependencyService } from '../../core/services/dependency.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ServerService } from '../../core/services/server.service';
import { MockServer } from '../../common/models/mock-server.model';
import { MatDialog, MatDialogRef, MatSort } from '@angular/material';
import { FormDialogComponent } from '../../core/components/form-dialog/form-dialog.component';
import { ADD_DEPENDENCY_FORM } from '../../common/constants/forms/add-dependency-form';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/observable/timer';
import { Observable } from 'rxjs/Observable';
import { Dependency } from '../../common/interfaces/dependency';
import { DataSource } from '@angular/cdk/collections';

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export class DependenciesDataSource extends DataSource<Dependency> {

  constructor(private server: MockServer) {
    super();
  }

  public connect(): Observable<Dependency[]> {
    return this.server.onDependenciesChange();
  }

  public disconnect() {}

}

@Component({
  templateUrl: './dependencies.component.html',
  styleUrls: ['./dependencies.component.scss']
})
export class DependenciesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort)
  public sort: MatSort;

  public server: MockServer;

  public displayedColumns: string[] = ['name', 'version', 'description', 'actions'];
  public dataSource: DependenciesDataSource;

  constructor(
    private dependencyService: DependencyService,
    private serverService: ServerService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
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
    this.dataSource = new DependenciesDataSource(this.server);
    this.cdr.detectChanges();
  }

  public addDependency(): void {
    const dialogRef: MatDialogRef<FormDialogComponent> = this.dialog.open(FormDialogComponent, {
      data: {
        title: 'Add Dependency',
        form: ADD_DEPENDENCY_FORM,
        submitText: 'Add',
        update: true
      }
    });

    let packageCache;
    dialogRef.componentInstance.onChange('name')
    .debounce(() => Observable.timer(500))
    .subscribe(value => {
      dialogRef.componentInstance.loading = true;
      dialogRef.componentInstance.setOptions('version', []);
      this.dependencyService.getPackage(value).subscribe(packageData => {
        packageCache = packageData;
        const versions = packageData.versions;
        versions.reverse();
        versions.unshift('latest');
        dialogRef.componentInstance.loading = false;
        dialogRef.componentInstance.setOptions('version', versions.map(version => {
          return {
            label: capitalizeFirstLetter(version),
            value: version
          };
        }));
        dialogRef.componentInstance.setValue('version', 'latest');
      });
    });

    dialogRef.afterClosed().subscribe((result: Dependency) => {
      if (result) {
        this.server.addDependency({
          name: packageCache.name,
          version: result.version,
          homepage: packageCache.homepage,
          description: packageCache.description
        });
        this.serverService.update(this.server);
        this.dependencyService
          .installDependency(this.server.id, result.name, result.version)
          .subscribe(() => {
            console.log(packageCache);
            console.log('finished install dependency');
          });
      }
    });
  }

  public deleteDependency(dependency: Dependency): void {
    this.dependencyService.removeDependency(this.server.id, dependency.name).subscribe(() => {
      console.log('delete successful');
      this.server.removeDependency(dependency.name);
      this.serverService.update(this.server);
    });
  }
}
