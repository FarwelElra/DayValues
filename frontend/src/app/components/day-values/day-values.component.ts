import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {DatePipe} from "@angular/common";
import {DayValuesInputDialogComponent} from "../day-values-input-dialog/day-values-input-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DayValueId, DayValues, DayValuesWithoutId} from "../../dto/dayValues/dayValues";
import {MatSort, Sort} from "@angular/material/sort";


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

  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = (data: DayValues, filter: string) => {
      const searchTerms = filter.split(' ');
      return searchTerms.every(term =>
        data.date.toString().toLowerCase().includes(term) ||
        data.sys.toString().toLowerCase().includes(term) ||
        data.dia.toString().toLowerCase().includes(term) ||
        data.pulse.toString().toLowerCase().includes(term) ||
        data.weight.toString().toLowerCase().includes(term)
      );
    }
  }

  ngOnInit(): void {
    this.loadData();
    this.dataSource.sort = this.sort
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

  checkboxLabel(row?: DayValues): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
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
      console.log(value.weight + 'got form the dialog');
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
    console.log(a);
    console.log(b);
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
