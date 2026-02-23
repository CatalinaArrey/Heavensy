import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  showCancel: boolean; 
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['../dialog-styles.scss'] 
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: DialogRef<boolean>, 
    @Inject(DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}