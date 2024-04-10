import {inject, Injectable} from "@angular/core";
import {DialogComponent} from "../../ViewModels/fragaments/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogType} from "../../ViewModels/fragaments/dialog/Models/DialogType";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  isVarEmpty(vari: any): boolean {
    if (vari === "" || vari === null || typeof vari === "undefined") {
      return true;
    } else {
      return false;
    }
  }
}
