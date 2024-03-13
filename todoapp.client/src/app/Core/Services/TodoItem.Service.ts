import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoItem } from '../Models/TodoItems';

const baseUrl = '/TodoItems';

@Injectable({
  providedIn: 'root'
})
export class TodoItemService  {

  constructor(private http: TodoItem) { }

  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(baseUrl);
  }

  get(id: any): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${baseUrl}/${id}`);
  }

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
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }
}
