﻿import {Component, inject, OnInit} from '@angular/core';
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
import {interval, Subscription} from "rxjs";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatChipListbox, MatChipListboxChange, MatChipOption} from "@angular/material/chips";
import {FilterOption} from "./subcomponents/FilterOption";

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
    MatCheckbox,
    FormsModule,
    MatChipOption,
    MatChipListbox,
  ],
})

export class TodoListComponent implements OnInit {
  /*Interfaces*/
  protected readonly FilterOption = FilterOption;

  /*Dependency Injections*/
  todoItemService = inject(TodoItemService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar)

  /*Class Variables*/
  todoItems: TodoItem[] | undefined
  isLoading: boolean;
  error: string;
  filterOption = FilterOption.All

  // @ts-ignore
  private timerSubscription: Subscription;
  constructor(private http: HttpClient) {
    this.isLoading = false
    this.error = "";
  }

  ngOnInit() {
    this.loadTodoList(true);
    this.timerSubscription = interval(5000).subscribe(() => {
      this.loadTodoList();
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadTodoList(isFirstLoad = false) {
    let apiCall;
    if (isFirstLoad) {
      this.isLoading = true;
    }
    switch (this.filterOption) {
      case FilterOption.All:
      default:
        let apiCall = this.todoItemService.checkGetAll(this.todoItems, isFirstLoad)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              this.todoItems = todoItems;
              if (isFirstLoad) {
                this.isLoading = false;
              }
              apiCall.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              apiCall.unsubscribe();
            }
          });
        break;
      case FilterOption.completed:
        let apiCall2 = this.todoItemService.checkGetAllCompleted(this.todoItems, isFirstLoad)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              this.todoItems = todoItems;
              if (isFirstLoad) {
                this.isLoading = false;
              }
              apiCall2.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              apiCall2.unsubscribe();

            }
          });
        break;
      case FilterOption.todays:
        let apiCall4 = this.todoItemService.checkGetAllTodaysTodo(this.todoItems, isFirstLoad)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              this.todoItems = todoItems;
              if (isFirstLoad) {
                this.isLoading = false;
              }
              apiCall4.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              apiCall4.unsubscribe();
            }
          });
        break;
      case FilterOption.tomorrows:
        let apiCall5 = this.todoItemService.checkGetAllTommorrowsTodo(this.todoItems, isFirstLoad)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              this.todoItems = todoItems;
              if (isFirstLoad) {
                this.isLoading = false;
              }
              apiCall5.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              apiCall5.unsubscribe();
            }
          });
        break;
      case FilterOption.notCompleted:
        let apiCall3 = this.todoItemService.checkGetAllNotCompleted(this.todoItems, isFirstLoad)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              this.todoItems = todoItems;
              if (isFirstLoad) {
                this.isLoading = false;
              }

              apiCall3.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              apiCall3.unsubscribe();
            }
          });
        break;
    }
  }

  openEditDialog(todoItem: TodoItem) {
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
        let apiCall = this.todoItemService.update(todoItem.id, result).subscribe(
          (res) => {
            this.loadTodoList()
            dialogRefSub.unsubscribe();
            apiCall.unsubscribe();
          },
          (error) => {
            console.error('Error updating todo item:', error);
            let snackBarRef = this.snackBar.open('An error occurred while putting data!', "Dismiss", {
              duration: 1000
            });
          }
        );
      }
    });
  }

  openCreateDialog(todoItem = new TodoItem()) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      data: {
        id: todoItem.id,
        title: todoItem.title,
        description: todoItem.description,
        dateTime: todoItem.dateTime,
        isComplete: todoItem.isComplete,
        dialogTitle: "Add a todo"
      },
      disableClose: true,
      height: 'fit-content',
      width: 'fit-content',
    });
    let dialogRefSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!result.title.isEmpty) {
          let apiCall = this.todoItemService.create(result).subscribe(
            (res) => {
              //console.log(res);
              this.loadTodoList()
              dialogRefSub.unsubscribe();
              apiCall.unsubscribe();
            },
            (error) => {
              console.error('Error updating todo item:', error);
              apiCall.unsubscribe();
            }
          );

        } else {
          dialogRefSub.unsubscribe();
        }
      }
    });
  }

  openDeleteDialog(event: Event, index: number, todoItem: TodoItem) {
    event.stopPropagation();
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
      if (btnType) {
        if (btnType === DialogBtnType.Positive) {
          let apiCall = this.todoItemService.delete(todoItem.id).subscribe(
            (result) => {
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

  taskComplete(event: Event, todoItem: TodoItem) {
    event.stopPropagation();

    let apiCall = this.todoItemService.update(todoItem.id, todoItem).subscribe(
      (res) => {
        if (todoItem.isComplete) {
          let snackBarRef = this.snackBar.open('Successfully Completed! Good Job!', "", {duration: 800});
        } else {
          let snackBarRef = this.snackBar.open('Successfully unCompleted! Good Job? I guess?', "", {duration: 800});
        }
        this.loadTodoList();
        apiCall.unsubscribe();
      },
      (error) => {
        console.error('Error updating todo item:', error);
        let snackBarRef = this.snackBar.open('Something went wrong!', "Dismiss", {
          duration: 1000
        });
        apiCall.unsubscribe();
      }
    );
  }

  filterSelected($event: MatChipListboxChange) {
    this.loadTodoList();
  }
}
