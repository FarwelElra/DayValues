import {Component} from '@angular/core';
import {RangeDialogComponent} from "../range-dialog/range-dialog.component";
import {GenericRange} from "../../dto/range/range";
import {DataService} from "../../services/data.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-filter-tool-bar',
  templateUrl: './filter-tool-bar.component.html',
  styleUrls: ['./filter-tool-bar.component.less']
})
export class FilterToolBarComponent {

  constructor(
    private data: DataService,
    private dialog: MatDialog
  ) {
  }

  getRepresentation(column: string) {
    return this.data.getFilterRepresentation(column);
  }

  delFilter(column: string) {
    this.data.delFilter(column)
  }

  openRangeDialog(column: string): void {
    const dataType = this.data.columnDataTypes.get(column) || 'number';
    const dialogRef = this.dialog.open(RangeDialogComponent, {
      data: {column, dataType},
    });

    dialogRef.afterClosed().subscribe({
      next: filterData => this.applyFilters(filterData)
    });
  }

  applyFilters(filterData: { column: string, filterValues: GenericRange<number | Date> }): void {
    if (filterData.filterValues && filterData.filterValues.min !== null && filterData.filterValues.max !== null) {
      this.data.addFilter(filterData.column, filterData.filterValues);
    }
  }
}
