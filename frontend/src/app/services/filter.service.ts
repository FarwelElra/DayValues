import {Injectable} from '@angular/core';
import {GenericRange} from "../dto/range/range";
import {DatePipe} from "@angular/common";
import {DayValues} from "../dto/dayValues/dayValues";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  columnFilters: Map<string, GenericRange<number | Date>> = new Map();
  columns = ['date', 'sys', 'dia', 'pulse', 'weight'];



  constructor(
    private datePipe: DatePipe,
  ) {
    this.columnFilters.set('date', {min: this.getMinDate(), max: new Date()})
  }

  getMinDate(): Date{
    let date = new Date();
    date.setDate(date.getDate() - 14);
    return date
  }

  rangeRepresentation(column: string): string {
    let filter = this.columnFilters.get(column);
    if (filter) {
      if (typeof filter.min === 'number') {
        return filter.min + ' - ' + filter.max;
      } else {
        return this.datePipe.transform(filter.min, 'dd.MM.yyyy') + ' - ' + this.datePipe.transform(filter.max, 'dd.MM.yyyy');
      }
    }
    return '';
  }

  getFilter = (dayValue: DayValues) => {
    let arr: { range: GenericRange<number | Date>, column: string }[] = [];

    this.columns.forEach(column => {
      let range = this.columnFilters.get(column);
      if (range) {
        arr.push({range: range, column: column})
      }
    });

    if (arr.length == 0) {
      return true;
    }

    return arr.map<boolean>(obj => {
      return this.filter(this.mapColumnsToValue(dayValue, obj.column), obj.column, obj.range)
    })
      .filter(bool => bool)
      .length == arr.length;
  };

  filter(value: number | Date, column: string, range: GenericRange<number | Date>): boolean {
    return column === 'date'
      ? new Date(value) >= new Date(range.min) && new Date(value) <= new Date(range.max)
      : value >= range.min && value <= range.max;
  }

  addFilter(column: string, filterValues: GenericRange<number | Date>) {
    this.columnFilters.set(column, filterValues)
  }

  delFilter(column: string) {
    this.columnFilters.delete(column);
  }

  mapColumnsToValue(dayValue: DayValues, column: string): number | Date {
    switch (column) {
      case 'date':
        return dayValue.date
      case 'sys':
        return dayValue.sys
      case 'dia':
        return dayValue.dia
      case 'pulse':
        return dayValue.pulse
      case 'weight':
        return dayValue.weight
      default :
        return 0
    }
  }
}
