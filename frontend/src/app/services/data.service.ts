import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {DayValues} from "../dto/dayValues/dayValues";
import {Router} from "@angular/router";
import {FilterService} from "./filter.service";
import {GenericRange} from "../dto/range/range";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dayValuesArr: DayValues[] = []
  outputValues  = new BehaviorSubject<DayValues[]>([]);

  columnDataTypes: Map<string, 'number' | 'date'> = new Map([
    ['date', 'date'],
    ['sys', 'number'],
    ['dia', 'number'],
    ['pulse', 'number'],
    ['weight', 'number']
  ]);

  constructor(private api: ApiService,
              private router: Router,
              private filter: FilterService
  ) {
  }

  refreshData(): void {
    this.api.loadAllDayValues().subscribe({
        next: values => {
          this.dayValuesArr = values;
          this.refreshFilter();
        },
        error: err => this.router.navigate(["/login"])
      }
    )
  }

  refreshFilter(): void {
    let filtered = this.dayValuesArr.filter(this.filter.getFilter);
    this.outputValues.next(filtered);
  }

  get dayValues() {
    return this.dayValuesArr;
  };

  addFilter(column: string, filterValues: GenericRange<number | Date>) {
    this.filter.addFilter(column, filterValues);
    this.refreshFilter();
  }

  delFilter(column: string) {
    this.filter.delFilter(column);
    this.refreshFilter();
  }

  getFilterRepresentation(column: string) {
    return this.filter.rangeRepresentation(column);
  }
}
