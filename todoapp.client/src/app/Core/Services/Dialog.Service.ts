import {inject, Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../ViewModels/fragaments/dialog/dialog.component";
import {DialogType} from "../../ViewModels/fragaments/dialog/Models/DialogType";
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  dialog = inject(MatDialog);

  alert(description: string, title: string = "", neutralBtn: string = "Ok") {
    return this.dialog.open(DialogComponent, {
      data: {
        title: title,
        description: description,
        neutralBtn: neutralBtn,
      },
      disableClose: true,
      minWidth: '292px',
    });
  }

  messageBox(description: string, title: string = "", dialogType: DialogType = DialogType.Ok, positiveBtn: string = "Yes", negativeBtn: string = "No", neutralBtn: string = "Cancel") {
    return this.dialog.open(DialogComponent, {
      data: {
        dialogType: DialogType,
        title: title,
        description: description,
        neutralBtn: neutralBtn,
        negativeBtn: negativeBtn,
        positiveBtn: positiveBtn,
      },
      disableClose: true,
      height: 'fit-content',
      minWidth: '292px',
    });
  }
}
