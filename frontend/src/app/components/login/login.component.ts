import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {AuthRequest} from "../../dto/auth/authRequest";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  form: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.form = fb.group(new AuthRequest("", ""));
  }


  submit() {
    this.auth.login(this.form.value);
  }
}
