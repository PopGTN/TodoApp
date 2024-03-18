import {Component, Inject} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {DialogType} from "./Models/DialogType";
import {DialogBtnType} from "./Models/DialogBtnType";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogTitle
  ],
})

export class DialogComponent {
  protected readonly DialogType = DialogType;
  protected readonly onsubmit = onsubmit;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {

      dialogType: DialogType
      title?: string,
      description?: string,
      neturalBtn?: string,
      negativeBtn?: string,
      postiveBtn?: string,
    },
  ) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }



  onSubmit(btnType:DialogBtnType): void {
    this.dialogRef.close(btnType);
  }

  protected readonly DialogBtnType = DialogBtnType;
}
