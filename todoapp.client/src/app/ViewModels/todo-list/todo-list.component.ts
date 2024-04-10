import {Component, inject, OnInit} from '@angular/core';
import {TodoItemService} from "../../Core/Services/TodoItem.Service";
import {TodoItem} from "../../Core/Models/TodoItems";
import {DatePipe, formatDate, NgIf, SlicePipe} from "@angular/common";

import {
  NgbAlert,
  NgbDropdown, NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbPagination,
  NgbTooltip
} from "@ng-bootstrap/ng-bootstrap";
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
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatChipListbox, MatChipListboxChange, MatChipOption, MatChipsModule} from "@angular/material/chips";
import {FilterOption} from "./subcomponents/FilterOption";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {MatPaginator} from "@angular/material/paginator";
import {UtilService} from "../../Core/Services/Util.Service";


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
    TranslocoPipe,
    MatChipsModule,
    DatePipe,
    DatePipe,
    MatPaginator,
    NgbPagination,
    SlicePipe,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbDropdown,
    NgbDropdownItem,
  ],
})

export class TodoListComponent implements OnInit {
  /*Interfaces*/
  protected readonly FilterOption = FilterOption;
  protected readonly formatDate = formatDate;

  /*Dependency Injections*/
  todoItemService = inject(TodoItemService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar)
  utilServ = inject(UtilService);

  /*Class Variables*/
  todoItems: TodoItem[] | undefined
  isLoading: boolean;
  error: string;
  filterOption = FilterOption.All
  searchString: string = "";
  page: number = 1;
  pageSize: number = 10;

  // @ts-ignore
  private timerSubscription: Subscription;

  constructor(private translocoService: TranslocoService) {
    this.isLoading = false
    this.error = "";
  }

  ngOnInit() {
    this.loadTodoList(true);
    // Check for updates every 5 seconds (adjust the interval as needed)
    this.timerSubscription = interval(5000).subscribe(() => {
      this.loadTodoList(false);
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
  loadTodoList(isFirstLoad = true) {
    let apiCall;
    if (isFirstLoad) {
      this.isLoading = true;
    }

    switch (this.filterOption) {
      case FilterOption.All:
      default:
        let getAllApiCall = this.todoItemService.getAll(this.searchString)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              const isSameFilter = this.filterOption == FilterOption.All || this.utilServ.isVarEmpty(this.filterOption);
              const isDataChanged = this.todoItemService.isDataChanged(todoItems, this.todoItems);
              var pageSize = this.pageSize;
              if (this.pageSize == this.todoItems?.length) {
                pageSize = todoItems.length;
              }
              if (isDataChanged && isSameFilter) {
                this.todoItems = todoItems; // Update the store with new data
                this.pageSize = pageSize
              }
              if (isFirstLoad) {
                this.isLoading = false;
              }
              getAllApiCall.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              getAllApiCall.unsubscribe();
            }
          });
        break;
      case FilterOption.completed:
        let getAllCompletedApiCall = this.todoItemService.getAllCompleted(this.searchString)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              const isSameFilter = this.filterOption == FilterOption.completed
              const isDataChanged = this.todoItemService.isDataChanged(todoItems, this.todoItems);
              var pageSize = this.pageSize;
              if (this.pageSize == this.todoItems?.length) {
                pageSize = todoItems.length;
              }
              if (isDataChanged && isSameFilter) {
                this.todoItems = todoItems; // Update the store with new data
                this.pageSize = pageSize
              }
              if (isFirstLoad) {
                this.isLoading = false;
              }
              getAllCompletedApiCall.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              getAllCompletedApiCall.unsubscribe();
            }
          });
        break;
      case FilterOption.todays:
        let getAllTodaysApiCall = this.todoItemService.getAllTodays()
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              const isSameFilter = this.filterOption == FilterOption.todays
              const isDataChanged = this.todoItemService.isDataChanged(todoItems, this.todoItems);
              var pageSize = this.pageSize;
              if (this.pageSize == this.todoItems?.length) {
                pageSize = todoItems.length;
              }
              if (isDataChanged && isSameFilter) {
                this.todoItems = todoItems; // Update the store with new data
                this.pageSize = pageSize
              }
              if (isFirstLoad) {
                this.isLoading = false;
              }
              getAllTodaysApiCall.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              getAllTodaysApiCall.unsubscribe();
            }
          });
        break;
      case FilterOption.tomorrows:
        let getAllTommorrowsApiCall = this.todoItemService.getAllTommorrows()
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              const isSameFilter = this.filterOption == FilterOption.tomorrows
              const isDataChanged = this.todoItemService.isDataChanged(todoItems, this.todoItems);
              var pageSize = this.pageSize;
              if (this.pageSize == this.todoItems?.length) {
                pageSize = todoItems.length;
              }
              if (isDataChanged && isSameFilter) {
                this.todoItems = todoItems; // Update the store with new data
                this.pageSize = pageSize
              }
              if (isFirstLoad) {
                this.isLoading = false;
              }
              getAllTommorrowsApiCall.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              getAllTommorrowsApiCall.unsubscribe();
            }
          });
        break;
      case FilterOption.notCompleted:
        let getAllNotCompletedApiCall = this.todoItemService.getAllNotCompleted()
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              const isSameFilter = this.filterOption == FilterOption.notCompleted
              const isDataChanged = this.todoItemService.isDataChanged(todoItems, this.todoItems);
              var pageSize = this.pageSize;
              if (this.pageSize == this.todoItems?.length) {
                pageSize = todoItems.length;
              }
              if (isDataChanged && isSameFilter) {
                this.todoItems = todoItems; // Update the store with new data
                this.pageSize = pageSize
              }
              if (isFirstLoad) {
                this.isLoading = false;
              }
              getAllNotCompletedApiCall.unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              getAllNotCompletedApiCall.unsubscribe();
            }
          });
        break;
      case FilterOption.search:
        let {unsubscribe} = this.todoItemService.getAll( this.searchString)
          .subscribe({
            next: (todoItems: TodoItem[]) => {
              const isSameFilter = this.filterOption == FilterOption.search
              const isDataChanged = this.todoItemService.isDataChanged(todoItems, this.todoItems);
              var pageSize = this.pageSize;
              if (this.pageSize == this.todoItems?.length) {
                pageSize = todoItems.length;
              }
              if (isDataChanged && isSameFilter) {
                this.todoItems = todoItems; // Update the store with new data
                this.pageSize = pageSize
              }
              unsubscribe();
            },
            error: err => {
              console.error('Error fetching todo list:', err);
              unsubscribe();
            }
          });
        break;
    }

  }

  /*Opens the Edit dialog when you hit the pencil button or tap on the todoItem*/
  openEditDialog(event: MouseEvent, todoItem: TodoItem) {
    event.stopImmediatePropagation();
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
            this.loadTodoList(false)
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

  /*This Is activated when the Create button is pressed*/
  openCreateDialog(todoItem = new TodoItem()) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      data: {
        id: todoItem.id,
        title: todoItem.title,
        description: todoItem.description,
        dateTime: todoItem.dateTime,
        isComplete: todoItem.isComplete,
        dialogTitle: this.translocoService.translate('todoList.addTodo'),
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
              this.loadTodoList(false)
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

  /*This is activated when a delete button is pressed. it then deletes the passed in todoItem*/
  openDeleteDialog(event: Event, index: number, todoItem: TodoItem) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        dialogType: DialogType.YesOrNo,
        title: this.translocoService.translate('dialogMessages.confirmTitle'),
        description: this.translocoService.translate('dialogMessages.confirmDescription'),
        neutralBtn: this.translocoService.translate('dialogMessages.neutralBtn'),
        negativeBtn: this.translocoService.translate('dialogMessages.negativeBtn'),
        positiveBtn: this.translocoService.translate('dialogMessages.positiveBtn'),
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
              this.loadTodoList(false)
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

  /*This method is used put the checkmark changes to the api*/
  taskComplete(event: Event, todoItem: TodoItem) {
    event.stopPropagation();

    let apiCall = this.todoItemService.update(todoItem.id, todoItem).subscribe(
      (res) => {
        if (todoItem.isComplete) {
          let snackBarRef = this.snackBar.open(this.translocoService.translate('snackbar.successCompleteMessage'), "", {duration: 800});
        } else {
          let snackBarRef = this.snackBar.open(this.translocoService.translate('snackbar.successUncompleteMessage'), "", {duration: 800});
        }
        this.loadTodoList(false);
        apiCall.unsubscribe();
      },
      (error) => {
        console.error('Error updating todo item:', error);
        let snackBarRef = this.snackBar.open(this.translocoService.translate('snackbar.errorMessage'), this.translocoService.translate('dismiss'), {duration: 1000});
        apiCall.unsubscribe();
      }
    );
  }

  /*Applys The filter to the Page*/
  filterSelected(value: FilterOption) {
    if (this.isLoading) {
      return;
    }
    this.filterOption = value
    this.loadTodoList(true);
  }

  SearchBtnClicked(searchTerm:string) {
    this.searchString =  searchTerm
    this.loadTodoList(true);

  }
}
