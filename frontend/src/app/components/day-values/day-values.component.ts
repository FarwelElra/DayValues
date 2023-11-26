import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {DatePipe} from "@angular/common";
import {DayValuesInputDialogComponent} from "../day-values-input-dialog/day-values-input-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DayValueId, DayValues, DayValuesWithoutId} from "../../dto/dayValues/dayValues";
import {MatSort, Sort} from "@angular/material/sort";
import {RangeDialogComponent} from "../range-dialog/range-dialog.component";
import {GenericRange} from "../../dto/range/range";


@Component({
  selector: 'app-day-values',
  templateUrl: './day-values.component.html',
  styleUrls: ['./day-values.component.less'],
  providers: [DatePipe]
})
export class DayValuesComponent implements OnInit {
  displayedColumns: string[] = ['select', 'date', 'sys', 'dia', 'pulse', 'weight'];
  dataSource = new MatTableDataSource<DayValues>();
  selection = new SelectionModel<DayValues>(true, []);
  @ViewChild(MatSort) sort!: MatSort;
  columnDataTypes: Map<string, 'number' | 'date'> = new Map([
    ['date', 'date'],
    ['sys', 'number'],
    ['dia', 'number'],
    ['pulse', 'number'],
    ['weight', 'number']
  ]);
  columnFilters: Map<string, GenericRange<number | Date>> = new Map;

  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    this.loadData()
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.api.loadAllDayValues().subscribe(
      {
        next: (data) => this.dataSource.data = data,
        error: err => console.error('Fehler beim Laden der Daten:', err)
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'dd.MM.yyyy');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DayValuesInputDialogComponent);
    dialogRef.afterClosed().subscribe({next: result => this.handleInput(result)});
  }

  handleInput(value: DayValuesWithoutId | undefined) {
    if (value) {
      this.api.saveDayValue(value).subscribe({
          complete: () => {
            this.loadData()
          }
        }
      );
    }
  }

  deleteSelected() {
    if (this.selection.selected.length > 0) {
      let ids: DayValueId[] = [];
      this.selection.selected.forEach(
        value => ids.push({id: value.id})
      );
      this.api.delete(ids)
        .subscribe({
            complete: () => this.handelDeletion()
          }
        );
    }
  }

  private handelDeletion() {
    this.selection.clear();
    this.loadData();
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sys':
          return this.compare(a.sys, b.sys, isAsc);
        case 'dia':
          return this.compare(a.dia, b.dia, isAsc);
        case 'pulse':
          return this.compare(a.pulse, b.pulse, isAsc);
        case 'weight':
          return this.compare(a.weight, b.weight, isAsc);
        case 'date':
          return this.compare(a.date, b.date, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openRangeDialog(column: string): void {
    const dataType = this.columnDataTypes.get(column) || 'number';
    const dialogRef = this.dialog.open(RangeDialogComponent, {
      data: {column, dataType},
    });

    dialogRef.afterClosed().subscribe({
      next: filterData => this.applyFilters(filterData)
    });
  }

  applyFilters(filterData: { column: string, filterValues: GenericRange<number | Date> }): void {
    if (filterData.filterValues && filterData.filterValues.min !== null && filterData.filterValues.max !== null) {

      this.columnFilters.set(filterData.column, filterData.filterValues)

      this.dataSource.filterPredicate = this.buildPredicate();
      this.dataSource.filter = 'test';
    }
  }

  createFilter(value: number | Date, filterValues: GenericRange<number | Date>): boolean {
    return value >= filterValues.min && value <= filterValues.max;
  }

  buildPredicate(): (data: DayValues, filter: string) => boolean {

    let dateFilter = this.columnFilters.get('date')
    let sysFilter = this.columnFilters.get('sys')
    let diaFilter = this.columnFilters.get('dia')
    let pulseFilter = this.columnFilters.get('pulse')
    let weightFilter = this.columnFilters.get('weight');

    return (data: DayValues) => {
      let result = true;
      if (dateFilter) {
        let x: GenericRange<Date> = {max: new Date(dateFilter.max), min: new Date(dateFilter.min)}
        result = this.createFilter(new Date(data.date), x)
      }
      if (sysFilter) {
        result = result && this.createFilter(data.sys, sysFilter)
      }
      if (diaFilter) {
        result = result && this.createFilter(data.dia, diaFilter)
      }
      if (pulseFilter) {
        result = result && this.createFilter(data.pulse, pulseFilter)
      }
      if (weightFilter) {
        result = result && this.createFilter(data.weight, weightFilter)
      }
      return result
    }
  }

  rangeRepresentation(column: string): string {
    let filter = this.columnFilters.get(column);
    if (filter) {
      if (typeof filter.min === 'number') {
        return filter.min + ' - ' + filter.max;
      } else {
        return this.datePipe.transform(filter.min, 'dd.MM.yyyy') + ' - ' + this.datePipe.transform(filter.min, 'dd.MM.yyyy');
      }
    }
    return '';
  }

  delFilter(column: string) {
    this.columnFilters.delete(column);
    this.dataSource.filterPredicate = this.buildPredicate();
    this.dataSource.filter = 'test';
  }
}
