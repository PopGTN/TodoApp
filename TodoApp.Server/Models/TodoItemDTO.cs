namespace TodoApp.Server.DTOs;

/*This is model allows secrets attributes to be added in the future to TodoItem.cs for example UserID, TodoListID*/
public class TodoItemDTO
{
  public int Id { get; set; }
  public string Title { get; set; }

  public string? Description { get; set; }
  public DateTime DateTime { get; set; }

  public bool IsComplete { get; set; }

  public TodoItemDTO() { }

  public TodoItemDTO(TodoItem todoItemP)
  {
    (Id, Title, Description, DateTime, IsComplete) =
      (todoItemP.Id, todoItemP.Title, todoItemP.Description, todoItemP.DateTime, todoItemP.IsComplete);
  }

  public override string ToString()
  {
    return $"Id: {Id}, Title: {Title}, Description: {Description}, IsComplete: {IsComplete}, DateTime: {DateTime}";
  }
}
