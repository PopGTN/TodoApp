import {Component, inject, Inject, Input} from '@angular/core';
import {NgbTimepicker, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
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
import {JsonPipe} from "@angular/common";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";

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
    MatDialogClose,
    NgbTimepicker,
    JsonPipe,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    TranslocoPipe
  ],
})
export class TodoDialogComponent {
  public dialog = inject(MatDialog);
  public translocoService = inject(TranslocoService);
  public errorMessage: string = "";


  // private translocoService: TranslocoService
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

  onNoClick() {
    this.dialogRef.close()
  }

  onSubmit(): void {

    if (!this.isValid()) {
      let ErrorDialogRef = this.dialog.open(DialogComponent, {
        data: {
          dialogType: DialogType.Ok,
          title: this.translocoService.translate('dialogMessages.formErrorTitle'),
          description: this.errorMessage,
          neutralBtn: this.translocoService.translate('dialogMessages.OkCancelBtn'),

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

  isValid() {
    this.errorMessage = ""
    let isValid = true;
    if (!this.data.title) {
      isValid = false;
      this.errorMessage += " - " + this.translocoService.translate('dialogMessages.formTitleErrorDesc') + "<br>"
    }
    return isValid;
  }
}
