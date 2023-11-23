import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SessionService} from "./session.service";
import {AuthRequest} from "../../dto/auth/authRequest";
import {AuthResponseDto} from "../../dto/auth/authResponse";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

const auth = '/authenticate';
const authApi = '/api/auth'
const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private session: SessionService, private router: Router) {
    this.loggedIn = new BehaviorSubject<boolean>(this.session.token != null);
  }

  get isUserLoggedIn() {
    return this.loggedIn.asObservable();
  }

  login(request: AuthRequest) {
    this.http
      .post<AuthResponseDto>(`${authApi}${auth}`, request, {headers})
      .subscribe({
        next: this.handleLogin,
        error: this.handleError,
        complete: this.handleComplete
      });
  }

  private handleLogin = (response: AuthResponseDto) => {
    this.session.token = response.token;
    this.loggedIn.next(true);
    this.router.navigate(["/home"]);
  }

  private handleError = (error: any) => {
    console.error(error);
  }

  private handleComplete = () => {
    console.log("completed")
  }

  logout() {
    this.session.clearStorage();
    this.loggedIn.next(false);
  }
}
