import {Component} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.less']
})
export class ToolBarComponent {

  show = false

  constructor(private auth: AuthService) {
    auth.isUserLoggedIn.subscribe(
      {
        next: value => this.show = value
      }
    )
  }

  logOut() {
    this.auth.logout();
  }
}
