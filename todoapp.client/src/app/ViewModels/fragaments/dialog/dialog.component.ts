import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { DialogType } from "./Models/DialogType";
import { DialogBtnType } from "./Models/DialogBtnType";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    NgIf
  ]
})
export class DialogComponent {
  protected readonly DialogType = DialogType;
  protected readonly DialogBtnType = DialogBtnType;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      dialogType: DialogType,
      title?: string,
      description?: string,
      neutralBtn?: string,
      negativeBtn?: string,
      positiveBtn?: string,
    },
  ) {}

  onNoClick(): void {
    console.log("Dialog Closed with nothing")
    alert(DialogBtnType.Neutral)
    this.dialogRef.close(DialogBtnType.Neutral);
  }

  onSubmit(btnType: DialogBtnType): void {
    console.log("Dialog Closed with " + btnType);
    let ouput = btnType +"";
    this.dialogRef.close(ouput);
  }
}
