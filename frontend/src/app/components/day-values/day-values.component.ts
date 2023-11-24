import {Component, OnInit} from '@angular/core';
import {DayValues} from "../../dto/dayValues/dayValues";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../../services/api.service";
import {DatePipe} from "@angular/common";

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


  constructor(private api: ApiService, private datePipe: DatePipe) {
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

}
