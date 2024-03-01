using Microsoft.EntityFrameworkCore;
using TodoApp.Server.DTOs;

namespace TodoApp.Server.Modules;

public static class TodoItemModule
{
  public static bool TestingMode { set; get; } = false; //Moved from Program.cs

  public static IServiceCollection RegisterTodoItemsModule(this IServiceCollection services)
  {
    return services;
  }
  public static IEndpointRouteBuilder MapTodoItemsEndpoints(this IEndpointRouteBuilder endpoints)
  {
    var mapGroup =  endpoints.MapGroup("TodoApp");
    mapGroup.MapGet("/", GetAllTodos);
    mapGroup.MapGet("/complete", GetCompleteTodos);
    mapGroup.MapGet("/{idP}", GetTodo);
    mapGroup.MapPost("/", CreateTodo);
    mapGroup.MapPut("/{idP}", UpdateTodo);
    mapGroup.MapDelete("/{idP}", DeleteTodo);

    return mapGroup;
  }


  private static async Task<IResult> GetAllTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Select(x => new TodoItemDTO(x)).ToArrayAsync());
  }

  private static async Task<IResult> GetCompleteTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Where(t => t.IsComplete).Select(x => new TodoItemDTO(x)).ToListAsync());
  }

  private static async Task<IResult> GetTodo(int idP, TodoContext dbP)
  {
    return await dbP.TodoItems.FindAsync(idP)
      is TodoItem todoitem
      ? TypedResults.Ok(new TodoItemDTO(todoitem))
      : TypedResults.NotFound();
  }

  private static async Task<IResult> CreateTodo(TodoItemDTO todoItemDTOP, TodoContext dbP)
  {
    var todoItem = new TodoItem
    {
      IsComplete = todoItemDTOP.IsComplete,
      Title = todoItemDTOP.Title,
      Description = todoItemDTOP.Description,
      DateTime = todoItemDTOP.DateTime

    };

    dbP.TodoItems.Add(todoItem);
    await dbP.SaveChangesAsync();

    todoItemDTOP = new TodoItemDTO(todoItem);

    return TypedResults.Created($"/todoitems/{todoItem.Id}", todoItemDTOP);
  }
  private static async Task<IResult> UpdateTodo(int idP, TodoItemDTO todoItemDTOP, TodoContext dbP)
  {
    var todoItem = await dbP.TodoItems.FindAsync(idP);

    if (todoItem is null) return TypedResults.NotFound();



    todoItem.Title = todoItemDTOP.Title;
    todoItem.Description = todoItemDTOP.Description;
    todoItem.DateTime = todoItemDTOP.DateTime;
    todoItem.IsComplete = todoItemDTOP.IsComplete;

    await dbP.SaveChangesAsync();

    return TypedResults.Ok();
  }

  private static async Task<IResult> DeleteTodo(int id, TodoContext dbP)
  {
    if (await dbP.TodoItems.FindAsync(id) is TodoItem TodoItemP)
    {
      dbP.TodoItems.Remove(TodoItemP);
      await dbP.SaveChangesAsync();
      return TypedResults.NoContent();
    }

    return TypedResults.NotFound();
  }
}
