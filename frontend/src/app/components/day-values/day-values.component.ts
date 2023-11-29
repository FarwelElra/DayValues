import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {DatePipe} from "@angular/common";
import {DayValuesInputDialogComponent} from "../day-values-input-dialog/day-values-input-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DayValueId, DayValues, DayValuesWithoutId} from "../../dto/dayValues/dayValues";
import {MatSort, Sort} from "@angular/material/sort";
import {FilterService} from "../../services/filter.service";
import {DataService} from "../../services/data.service";


@Component({
  selector: 'app-day-values',
  templateUrl: './day-values.component.html',
  styleUrls: ['./day-values.component.less'],
  providers: [DatePipe]
})
export class DayValuesComponent implements OnInit{
  displayedColumns: string[] = ['select', 'date', 'sys', 'dia', 'pulse', 'weight'];
  dataSource = new MatTableDataSource<DayValues>();
  selection = new SelectionModel<DayValues>(true, []);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private filter: FilterService,
    public data: DataService,
    private datePipe: DatePipe
  ) {
  }

  setData(values: DayValues[]){
    this.dataSource.data = values;
    this.dataSource.sort;
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
            this.data.refreshData()
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
    this.data.refreshData();
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

  ngOnInit(): void {
    this.data.outputValues.subscribe({
      next: value => this.setData(value)
    });
  }
}
