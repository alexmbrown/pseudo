import { Component, Input } from '@angular/core';
import { LogEntry } from '../../../common/interfaces/log-entry';

@Component({
  selector: 'psd-log-entry',
  templateUrl: `./log-entry.component.html`,
  styleUrls: ['./log-entry.component.scss']
})
export class LogEntryComponent {

  @Input()
  public entry: LogEntry;

  public getMethodAbbreviation(method: string): string {
    switch (method.toLowerCase()) {
      case 'delete': return 'DEL';
      case 'patch': return 'PTCH';
      case 'options': return 'OPTS';
      default: return method;
    }
  }

  public getStatusIndicator(status: number): string {
    if (status < 300) {
      return 'success';
    } else if (status < 400) {
      return 'warn';
    }
    return 'fail';
  }

}
