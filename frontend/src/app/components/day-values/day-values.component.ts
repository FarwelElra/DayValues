import {Component, OnInit} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {DatePipe} from "@angular/common";
import {DayValuesInputDialogComponent} from "../day-values-input-dialog/day-values-input-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DayValueId, DayValues, DayValuesWithoutId} from "../../dto/dayValues/dayValues";


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


  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadData();
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
}
