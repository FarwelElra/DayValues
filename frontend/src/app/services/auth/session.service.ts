import {Injectable} from '@angular/core';
import {UserDto} from "../../dto/auth/user";

const TOKEN_KEY = 'auth-token'
const USER_KEY = 'auth-user'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {
  }

  set token(token: string | null) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    if (token != null) {
      window.sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearStorage() {
    window.sessionStorage.clear();
    window.location.reload();
  }

  saveUser(user: UserDto) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  get token() {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  get user() {
    return window.sessionStorage.getItem(USER_KEY);
  }
}
