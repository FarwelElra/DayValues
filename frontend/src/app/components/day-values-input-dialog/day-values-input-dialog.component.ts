import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-day-values-input-dialog',
  templateUrl: './day-values-input-dialog.component.html',
  styleUrls: ['./day-values-input-dialog.component.less']
})
export class DayValuesInputDialogComponent {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DayValuesInputDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      date: [null, Validators.required],
      sys: [null, [Validators.required, Validators.min(1)]],
      dia: [null, [Validators.required, Validators.min(1)]],
      pulse: [null, [Validators.required, Validators.min(1)]],
      weight: [null, [Validators.required, Validators.min(1)]],
    });
  }

  submitForm(formResult: FormGroup) {
    this.dialogRef.close(formResult.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  isFieldValid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.valid || !control.touched : false;
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('min')) {
      return `Must be greater than or equal to 1`;
    }
    return '';
  }
}
