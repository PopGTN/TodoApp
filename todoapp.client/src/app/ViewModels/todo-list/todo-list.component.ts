import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TodoItemService} from "../../Core/Services/TodoItem.Service";
import {TodoItem} from "../../Core/Models/TodoItems";
import {NgIf} from "@angular/common";

import {NgbAlert, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";
import {EditDialogComponent} from "./subcomponents/edit-dialog/edit-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {F} from "@angular/cdk/keycodes";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";

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
    EditDialogComponent,
    MatFormFieldModule,
  ]
})
export class TodoListComponent implements OnInit {
  isLoading: boolean;
  error: string;
  private todoItemService = inject(TodoItemService);
  public dialog = inject(MatDialog);

  public todoItems: TodoItem[] = [];
  Title = "Weather App"

  constructor(private http: HttpClient) {
    this.isLoading = false
    this.error = "";
  }

  ngOnInit() {

    this.loadTodoList();
  }

  loadTodoList() {
    this.isLoading = true;
    this.todoItemService.getAll().subscribe(
      (response) => {
        this.todoItems = response;
        this.isLoading = false;
      },
      (error) => {
        this.error = 'An error occurred while fetching data';
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  }

  /*This Method is for editing files*/
  openEditDialog(index: number, todoItem: TodoItem) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        todoItem: todoItem,
        title: "Modify " + todoItem.id
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

}
