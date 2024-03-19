import {Component, inject, Inject, Input} from '@angular/core';
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {TodoItem} from "../../../Core/Models/TodoItems";
import {DialogComponent} from "../dialog/dialog.component";
import {DialogType} from "../dialog/Models/DialogType";

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
  public dialog = inject(MatDialog);
  public errorMessage: string;
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
  ) {
    this.errorMessage = "Please sure your following imputs are valid! <br>";
  }

  onNoClick(){
    this.dialogRef.close()
  }
  onSubmit(): void {

    if (!this.isValid()) {
      let ErrorDialogRef = this.dialog.open(DialogComponent, {
      data: {
        dialogType: DialogType.Ok,
        title: "🫸🛑 HOLD UP!",
        description: this.errorMessage

      },
        height: 'fit-content',
        width: 'fit-content',
        disableClose: true,
      });
      let dialogResult = ErrorDialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
      dialogResult.unsubscribe();
      return;
    } else {

      let todoItem = new TodoItem(this.data.id, this.data.title, this.data.description, this.data.dateTime, this.data.isComplete)

      this.dialogRef.close(todoItem);
    }
  }

  isValid(){
    this.errorMessage = ""
    let isValid = true;
    if (!this.data.title){
      isValid = false;
      this.errorMessage += " - Todo must have a title <br>"
    }
    return isValid;
    /*Left Room to make more requirments here if needed!*/
  }
}
