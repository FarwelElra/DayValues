import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-side-nav-entry',
  templateUrl: './side-nav-entry.component.html',
  styleUrls: ['./side-nav-entry.component.less']
})
export class SideNavEntryComponent {

  @Input("route")
  route = '';
  @Input("title")
  title = '';
  @Input('icon')
  icon: string = '';


  constructor(private router: Router) {
  }

  nav() {
    this.router.navigate([this.route]);
  }
}
