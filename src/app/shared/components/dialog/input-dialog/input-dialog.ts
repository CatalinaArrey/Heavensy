import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { F } from '@angular/cdk/keycodes';


export interface InputDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-input-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-dialog.html',
  styleUrls: ['../dialog-styles.scss'] 
})
export class InputDialogComponent {
  public inputValue: string = ''; 

  constructor(
    public dialogRef: DialogRef<string>, 
    @Inject(DIALOG_DATA) public data: InputDialogData
  ) {}

  onConfirm() {
    this.dialogRef.close(this.inputValue);
  }

  onCancel() {
    this.dialogRef.close(''); 
  }
}