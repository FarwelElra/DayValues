import {Component} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.less']
})
export class ToolBarComponent {

  constructor(private auth: AuthService) {
  }

  logOut() {
    this.auth.logout();
  }
}
