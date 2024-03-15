import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TodoItemService} from "../../Core/Services/TodoItem.Service";
import {TodoItem} from "../../Core/Models/TodoItems";
import {JsonPipe, NgIf} from "@angular/common";

import {NgbAlert, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {MatProgressBar} from "@angular/material/progress-bar";
import {CreateTodoItemComponent} from "./subcomponents/create-todo-item/create-todo-item.component";
import {EditDialogComponent} from "./subcomponents/edit-dialog/edit-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
  standalone: true,
  imports: [
    JsonPipe,
    NgbAlert,
    NgIf,
    RouterLink,
    MatProgressBar,
    NgbTooltip,
    CreateTodoItemComponent,
    EditDialogComponent,
  ]
})
export class TodoListComponent implements OnInit  {
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
    this.getForecasts();
    EditDialogComponent
  }
  getForecasts() {
    this.todoItemService.getAll()

    this.todoItemService.getAll().subscribe((response) => {
      this.todoItems = response;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.error = 'An error occurred while fetching data';
      console.log('Error:', error);
    });
  }
}
