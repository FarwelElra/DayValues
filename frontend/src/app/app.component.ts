import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {SideNavEntry} from "./dto/sideNav/sideNav";

const sideNavEntries: SideNavEntry[] = [
  {title: "Home", route: '/home', icon:'home'},
  {title: "Day values", route: '/dayValues', icon: ''}
]


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  sideNavEntities = sideNavEntries;
  constructor(router: Router) {
    router.navigate(["/home"]);
  }
}
