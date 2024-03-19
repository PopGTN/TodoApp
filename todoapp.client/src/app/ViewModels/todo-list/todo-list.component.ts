import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TodoItemService} from "../../Core/Services/TodoItem.Service";
import {TodoItem} from "../../Core/Models/TodoItems";
import {NgIf} from "@angular/common";

import {NgbAlert, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatDialog} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TodoDialogComponent} from "../fragaments/todo-dialog/todo-dialog.component";
import {DialogComponent} from "../fragaments/dialog/dialog.component";
import {DialogType} from "../fragaments/dialog/Models/DialogType";
import {DialogBtnType} from "../fragaments/dialog/Models/DialogBtnType";
import {checkPopoverMargin} from "ngx-bootstrap/positioning/utils/checkMargin";
import {bgLocale} from "ngx-bootstrap/chronos";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  standalone: true,
  imports: [
    NgbAlert,
    NgIf,
    RouterLink,
    MatProgressBar,
    NgbTooltip,
    TodoDialogComponent,
    MatFormFieldModule,
    MatFabButton,
    MatFormFieldModule,
    MatIconModule,
    MatMiniFabButton,
  ],
})

export class TodoListComponent implements OnInit {


  isLoading: boolean;
  error: string;
  private todoItemService = inject(TodoItemService);
  public dialog = inject(MatDialog);

  public todoItems: TodoItem[] = [];
  Title = "Weather App"

  // @ts-ignore
  private timerSubscription: Subscription;
  constructor(private http: HttpClient) {
    this.isLoading = false
    this.error = "";
  }

  ngOnInit() {
    this.loadTodoList(true);
    // Check for updates every 5 seconds (adjust the interval as needed)
    this.timerSubscription = interval(5000).subscribe(() => {
      console.log("loaded")
      this.loadTodoList();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the timer to avoid memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  /*
      Only needs to show the load on first load because after that its already loaded and the
      it get check if changed and it will only update when it gets the data from the api
      */

  loadTodoList(isFirstLoad = false) {
    if (isFirstLoad) {
      console.log("first load")
      this.isLoading = true;
    }
    this.todoItemService.getAll().subscribe(
      (response) => {
        let isDataChanged = this.isDataChanged(response);
        console.log("Data Changed? "+ isDataChanged)
        if (isDataChanged) { // Check if there are any changes
          this.todoItems = response;
          console.log("YES it did")
        } else {
          console.log("No it didn't")
        }
        if (isFirstLoad) {
          this.isLoading = false;
        }
      },
      (error) => {
        this.error = 'An error occurred while fetching data';
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  }

  private isDataChanged(newData: TodoItem[]): boolean {
    if (newData.length !== this.todoItems.length) {
      return true; // If the lengths are different, there are changes
    }

    // Check if any item has changed
    for (let i = 0; i < newData.length; i++) {
      if (!this.areEqual(newData[i], this.todoItems[i])) {
        return true; // If any item is different, there are changes
      }
    }
    return false; // No changes
  }

  private areEqual(item1: TodoItem, item2: TodoItem): boolean {
    // Compare properties of the items to check for equality
    return item1.id === item2.id &&
      item1.title === item2.title &&
      item1.description === item2.description &&
      item1.dateTime === item2.dateTime &&
      item1.isComplete === item2.isComplete;
  }

  /*This Method is for editing files*/

  openEditDialog(index: number, todoItem: TodoItem) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      data: {
        id: todoItem.id,
        title: todoItem.title,
        description: todoItem.description,
        dateTime: todoItem.dateTime,
        isComplete: todoItem.isComplete,
        dialogTitle: "Modify " + todoItem.id
      },
      disableClose: true,
      height: 'fit-content',
      width: 'fit-content',
    });

    let dialogRefSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoItemService.update(todoItem.id, result).subscribe(
          (res) => {
            this.loadTodoList();
            console.log(res);
            this.loadTodoList()
            dialogRefSub.unsubscribe();
          },
          (error) => {
            console.error('Error updating todo item:', error);
          }
        );
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      data: {
        id: undefined,
        title: undefined,
        description: undefined,
        dateTime: undefined,
        isComplete: undefined,
        dialogTitle: ""
      },
      disableClose: true,
      height: 'fit-content',
      width: 'fit-content',
    });

    let dialogRefSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoItemService.create(result).subscribe(
          (res) => {
            console.log(res);
            this.loadTodoList()
            dialogRefSub.unsubscribe();
          },
          (error) => {
            console.error('Error updating todo item:', error);
          }
        );
      }
    });
  }

  openDeleteDialog(index: number, todoItem: TodoItem) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        dialogType: DialogType.YesOrNo,
        title: "Wait! Hold up!",
        description: "Are you sure you wanted to delete this todo? Because it will be gone forever!"
      },
      disableClose: true,
      height: 'fit-content',
      width: 'fit-content',
    });

    let dialogRefSub = dialogRef.afterClosed().subscribe(btnType => {
      console.log(btnType)
      if (btnType) {
        console.log(btnType === DialogBtnType.Neutral);
        console.log(btnType === DialogBtnType.Negative);
        console.log(btnType === DialogBtnType.Positive);
        if(DialogBtnType.Neutral){
          let apiCall = this.todoItemService.delete(todoItem.id).subscribe(
            (result) => {
              console.log(result)
              this.loadTodoList()
              apiCall.unsubscribe();
              dialogRefSub.unsubscribe();
            },
            (error) => {
              console.error('Error updating todo item:', error);
              apiCall.unsubscribe();
              dialogRefSub.unsubscribe();
            }
          );

        }
      }
    });
  }
}
