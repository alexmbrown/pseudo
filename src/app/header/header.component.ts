import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'psd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output()
  public toggleSideNav: EventEmitter<void> = new EventEmitter<void>();

}
