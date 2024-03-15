import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { TodoItem } from '../Models/TodoItems';
import {TAB} from "@angular/cdk/keycodes";
import {createStore, select, withProps} from "@ngneat/elf";
import {withEntities, withUIEntities} from "@ngneat/elf-entities";
import {TodoRepo, todoStore} from "../state/todo-store";

const baseUrl = '/todoitems';

@Injectable({
  providedIn: 'root'
})
export class TodoItemService  {

  constructor(private http: HttpClient, private todoStore: TodoRepo) { }


  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(baseUrl, {responseType: 'json'}).pipe(
      tap(todoItems => this.todoStore.setTodos(todoItems)) // Update the store with fetched data
    );
  }

  get(id: any): Observable<TodoItem> {
    // @ts-ignore
    return this.http.get<TodoItem>(`${baseUrl}/${id}`).pipe(tap(todoItem => {
      // this.repoStore.getTodoByID(id);
    }));

  }
//update add
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(`${baseUrl}?title=${title}`);
  }
}

