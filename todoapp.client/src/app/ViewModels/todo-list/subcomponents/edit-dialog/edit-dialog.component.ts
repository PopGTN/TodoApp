import {Component, Inject, Input} from '@angular/core';
import {TodoItem} from "../../../../Core/Models/TodoItems";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css',
  standalone: true,
  imports: [
    NgbTooltip,
    FormsModule,
    MatFormField,
    MatDialogContent,
    MatInput,
    MatButton,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose
  ],
})
export class EditDialogComponent {
  // @Input() todoItem: TodoItem | undefined;
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todoItem: TodoItem},
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
