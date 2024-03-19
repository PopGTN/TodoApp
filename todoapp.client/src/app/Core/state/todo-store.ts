import {createStore} from "@ngneat/elf";
import {getEntity, selectEntity, setEntities, withEntities} from "@ngneat/elf-entities";
import {TodoItem} from "../Models/TodoItems";
import {Injectable} from "@angular/core";
import {syncState} from "elf-sync-state";
import {localStorageStrategy, persistState} from "@ngneat/elf-persist-state";

export const todoStore = createStore(
  {name: 'todoItems'},
  withEntities<TodoItem>(),
);

/*
Persist State added. Might Work on making a queue where the use is offline and make them once they comeback online it
all the changes will be then saved to the database.
*/
export const persist = persistState(todoStore, {
  key: 'todoItems',
  storage: localStorageStrategy,
});


syncState(todoStore);

@Injectable({
  providedIn: 'root'
})
export class TodoRepo {


  setTodos(todoItem: TodoItem[]) {
    todoStore.update(setEntities(todoItem))
  }


  getTodoByID(id: any) {
    return todoStore.pipe(selectEntity(id, {pluck: (todoItem) => todoItem.id}));

  }
}
