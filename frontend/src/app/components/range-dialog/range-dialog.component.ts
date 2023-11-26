import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {GenericRange} from "../../dto/range/range";


interface RangeDialogData {
  column: string;
  dataType: 'number' | 'date';
}

@Component({
  selector: 'app-range-dialog',
  templateUrl: './range-dialog.component.html',
  styleUrls: ['./range-dialog.component.less']
})
export class RangeDialogComponent {
  rangeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RangeDialogData,
    private fb: FormBuilder) {
    this.rangeForm = this.fb.group({
      min:[null],
      max: [null]
    });
  }

  applyFilter(): void {
    if (this.rangeForm.valid) {
      const filterValues: GenericRange<any> = this.rangeForm.value;
      this.dialogRef.close({column: this.data.column, filterValues});
    } else {
      console.error('Form is not valid.');
    }
  }

  closeDialog(): void {
    this.dialogRef.close({});
  }
}
