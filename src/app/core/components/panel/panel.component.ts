import { Component, Input } from '@angular/core';

@Component({
  selector: 'psd-panel-actions,psd-panel-content',
  template: '<ng-content></ng-content>',
})
export class PanelChildComponent {}

@Component({
  selector: 'psd-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent {

  @Input()
  public title: string;

  @Input()
  public subTitle: string;

}
