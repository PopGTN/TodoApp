namespace TodoApp.Test_Project;

using Refit;
using Server.Models;

public interface ITodoApi
{
  [Get("/todoitems/{id}")]
  Task<TodoItemDTO> GetTodoItemAsync(int id);

  [Get("/todoitems")]
  Task<List<TodoItemDTO>> GetAllTodoItemsAsync();

  [Get("/todoitems/complete")]
  Task<List<TodoItemDTO>> GetCompletedTodoItemsAsync();

  [Get("/todoitems/notcomplete")]
  Task<List<TodoItemDTO>> GetNotCompletedTodoItemsAsync();

  [Get("/todoitems/tommorrows")]
  Task<List<TodoItemDTO>> GetTommorrowsTodoItemsAsync();

  [Get("/todoitems/todays")]
  Task<List<TodoItemDTO>> GetTodaysTodoItemsAsync();

  [Post("/todoitems")]
  Task<TodoItemDTO> PostTodoItemAsync([Body] TodoItemDTO todoItemDto);

  [Delete("/todoitems/{id}")]
  Task DeleteTodoItemAsync(int id);
}
