import {Component, Inject, Input} from '@angular/core';
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {TodoItem} from "../../../Core/Models/TodoItems";

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrl: './todo-dialog.component.css',
  standalone: true,
  imports: [
    NgbTooltip,
    FormsModule,
    MatFormField,
    MatDialogContent,
    MatInput,
    MatFormFieldModule,
    MatButton,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose
  ],
})
export class TodoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {

      id?: number,
      title?: string,
      description?: string,
      dateTime?: string,
      isComplete?: boolean,
      dialogTitle?: string
    },
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(){
    let todoItem = new TodoItem(this.data.id, this.data.title, this.data.description, this.data.dateTime, this.data.isComplete)
    this.dialogRef.close(todoItem);
  }
}
