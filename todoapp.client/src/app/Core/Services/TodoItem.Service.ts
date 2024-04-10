import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {TodoItem} from '../Models/TodoItems';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TodoRepo} from "../state/todo-store";
import {UtilService} from "./Util.Service";

const baseUrl = '/todoitems';

@Injectable({
  providedIn: 'root'
})
export class TodoItemService {
  utilServ = inject(UtilService);

  private error: string = '';

  constructor(private http: HttpClient, private todoStore: TodoRepo) {
  }


  getAll(search:string = "", orderby:string ="title"): Observable<TodoItem[]> {
    if (search.length != 0){
      return this.http.get<TodoItem[]>(`${baseUrl}?orderby=${orderby}&search=${search}`);
    }
    return this.http.get<TodoItem[]>(baseUrl).pipe(
      tap(todoItems => this.todoStore.setTodos(todoItems)) // Update the store with fetched data
    );
  }

  getAllCompleted(search:string = "", orderby:string ="title"): Observable<TodoItem[]> {
    if (search.length != 0) {
      this.http.get<TodoItem[]>(`${baseUrl}?filter=completed?orderby=${orderby}&search=${search}`, {responseType: 'json'});
    }
    return this.http.get<TodoItem[]>(`${baseUrl}?filter=completed`, {responseType: 'json'});
  }

  getAllNotCompleted(search:string = "", orderby:string ="title"): Observable<TodoItem[]> {''
    if (search.length != 0) {
      this.http.get<TodoItem[]>(`${baseUrl}?filter=uncompleted?orderby=${orderby}&search=${search}`, {responseType: 'json'});
    }
    return this.http.get<TodoItem[]>(`${baseUrl}?filter=uncompleted`, {responseType: 'json'});
  }

  getAllTodays(search:string = "", orderby:string ="title"): Observable<TodoItem[]> {
    if (search.length != 0) {
      this.http.get<TodoItem[]>(`${baseUrl}?filter=todays?orderby=${orderby}&search=${search}`, {responseType: 'json'});
    }
    return this.http.get<TodoItem[]>(`${baseUrl}/?filter=todays`, {responseType: 'json'});
  }

  getAllTommorrows(search:string = "", orderby:string ="title"): Observable<TodoItem[]> {
    if (search.length != 0) {
      this.http.get<TodoItem[]>(`${baseUrl}?filter=tomorrows?orderby=${orderby}&search=${search}`, {responseType: 'json'});
    }
    return this.http.get<TodoItem[]>(`${baseUrl}/?filter=tomorrows`, {responseType: 'json'});
  }

  get(id: any): Observable<TodoItem> {
    // @ts-ignore
    return this.http.get<TodoItem>(`${baseUrl}/${id}`).pipe(tap(todoItem => {
      this.todoStore.getTodoByID(id);
    }));
  }

//update add
  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: TodoItem): Observable<any> {
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

  checkGetAll(oldList: TodoItem[] | undefined, isFirstLoad: boolean = false, search:string = ""): Observable<TodoItem[]> {
    return this.getAll(search).pipe(
      tap(newList => {

        if (oldList !== undefined) {
          const isDataChanged = this.isDataChanged(newList, oldList);
          if (isDataChanged) {
            this.todoStore.setTodos(newList); // Update the store with new data
          }
        } else {
          this.todoStore.setTodos(newList); // Update the store with new data
        }
      })
    );
  }

  checkGetAllNotCompleted(oldList: TodoItem[] | undefined,): Observable<TodoItem[]> {
    return this.getAllNotCompleted().pipe(
      tap(newList => {

        if (oldList !== undefined) {
          const isDataChanged = this.isDataChanged(newList, oldList);
          if (isDataChanged) {
            this.todoStore.setTodos(newList); // Update the store with new data
          }
        } else {
          this.todoStore.setTodos(newList); // Update the store with new data
        }
      })
    );
  }

  checkGetAllTodaysTodo(oldList: TodoItem[] | undefined,): Observable<TodoItem[]> {
    return this.getAllTodays().pipe(
      tap(newList => {

        if (oldList !== undefined) {
          const isDataChanged = this.isDataChanged(newList, oldList);
          if (isDataChanged) {
            this.todoStore.setTodos(newList); // Update the store with new data
          }
        } else {
          this.todoStore.setTodos(newList); // Update the store with new data
        }
      })
    );
  }

  checkGetAllTommorrowsTodo(oldList: TodoItem[] | undefined,): Observable<TodoItem[]> {
    return this.getAllTommorrows().pipe(
      tap(newList => {

        if (oldList !== undefined) {
          const isDataChanged = this.isDataChanged(newList, oldList);
          if (isDataChanged) {
            this.todoStore.setTodos(newList); // Update the store with new data
          }
        } else {
          this.todoStore.setTodos(newList); // Updaete the store with new data
        }
      })
    );
  }

  checkGetAllCompleted(oldList: TodoItem[] | undefined,): Observable<TodoItem[]> {
    return this.getAllCompleted().pipe(
      tap(newList => {
        if (oldList !== undefined) {
          const isDataChanged = this.isDataChanged(newList, oldList);
          if (isDataChanged) {
            this.todoStore.setTodos(newList); // Update the store with new data
          }
        } else {
          this.todoStore.setTodos(newList); // Update the store with new data
        }
      })
    );
  }

  public isDataChanged(newData: TodoItem[], oldList: TodoItem[] | undefined): boolean {
    if (oldList === undefined || oldList.length == 0 || newData.length !== oldList.length) {
      return true
    }
    // Check if any item has changed
    for (let i = 0; i < newData.length; i++) {
      if (!this.areEqual(newData[i], oldList[i])) {
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
}

