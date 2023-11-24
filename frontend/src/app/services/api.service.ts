import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

const apiUrl = 'api/dayValues/all';
const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }


  loadAllDayValues(): Observable<any> {
    return this.http.get(`${apiUrl}`, {headers});
  }
}
