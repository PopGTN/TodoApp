import {createStore} from "@ngneat/elf";
import {getEntity, selectEntity, setEntities, withEntities} from "@ngneat/elf-entities";
import {TodoItem} from "../Models/TodoItems";
import {Injectable} from "@angular/core";
import {syncState} from "elf-sync-state";
import {localStorageStrategy, persistState} from "@ngneat/elf-persist-state";


//This for holding Active Todo In memory
export const todoStore = createStore(
  {name: 'todoItems'},
  withEntities<TodoItem>(),
);

/*
  Persist State added. Might Work on making a queue where the use is offline and make them once they comeback online it
  all the changes will be then saved to the database.
*/

//This is from Elf it adds Presist state to Survive page refreshes and syncs state across multiple tabs
// very time todoStore changes, this plugin serializes the state and saves it into localStorage under the key 'todoItems'
//This Also like Local Coache to Save the old Data from last time or when the page reloads so you dont look like a slow page
//  because you would have to add a loading state and wait for the data to come back from the server but with this you
// can just load the old data and then update it when the new data comes in 
export const persist = persistState(todoStore, {
  key: 'todoItems',
  storage: localStorageStrategy,
});
syncState(todoStore);

//injectable repo to interact with the store
@Injectable({
  providedIn: 'root'
})
export class TodoRepo {
  
  //Updates TodoItem[]: This is a method to set the todo items in the store, it takes an array of todo items and updates the store with them
  setTodos(todoItem: TodoItem[]) {
    todoStore.update(setEntities(todoItem))
  }
  
  //Get TodoItem by ID: This is a method to get a todo item by its ID, it takes an ID and returns the corresponding todo item from the store
  getTodoByID(id: any) {
    return todoStore.pipe(selectEntity(id, {pluck: (todoItem) => todoItem.id}));
  }
}
