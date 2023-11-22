// noinspection JSUnusedGlobalSymbols

import {Injectable} from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {


  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.auth.isUserLoggedIn.subscribe({
      next: this.next.bind(this)
    })
    return true;
  }

  next = (value : boolean) => {
    if(!value){
      this.router.navigate(["/login"]);
    }
  }

}
