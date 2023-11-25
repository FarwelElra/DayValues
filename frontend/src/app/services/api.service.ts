import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DayValueId, DayValuesWithoutId} from "../dto/dayValues/dayValues";

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

  saveDayValue(value: DayValuesWithoutId) {
    return this.http.post('/api/dayValues/add', value, {headers});
  }

  delete(value: DayValueId[]) {
    console.log('delete')
    return this.http.post('api/dayValues/delete', value, {headers});
  }
}

