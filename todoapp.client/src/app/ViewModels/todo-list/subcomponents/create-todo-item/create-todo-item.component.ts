import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TodoItem} from "../../../../Core/Models/TodoItems";

@Component({
  selector: 'app-create-todo-item',
  templateUrl: './create-todo-item.component.html',
  styleUrl: './create-todo-item.component.css',
  standalone: true,
  imports: [],
})
export class CreateTodoItemComponent {
  // @Input() todoitem: TodoItem | undefined;
  @Output() addItemEvent = new EventEmitter<any>();

  addItem() {

  }
}
