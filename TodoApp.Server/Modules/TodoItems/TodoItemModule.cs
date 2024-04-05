using Microsoft.EntityFrameworkCore;
using TodoApp.Server.Interfaces;
using TodoApp.Server.Models;

namespace TodoApp.Server.Modules.TodoItems;

public class TodoItemModule : IModule
{
  public IServiceCollection RegisterModule(IServiceCollection services)
  {
    return services;
  }

  public IEndpointRouteBuilder MapEndpoints(IEndpointRouteBuilder endpoints)
  {
    var mapGroup = endpoints.MapGroup("todoitems");
    mapGroup.MapGet("/", GetAllTodos);
    mapGroup.MapGet("/filt", GetCompleteTodos);
    mapGroup.MapGet("/notcomplete", GetNotCompleteTodos);
    mapGroup.MapGet("/todays", GetTodayTodos);
    mapGroup.MapGet("/tommorrows", GetTomorrowTodos);
    mapGroup.MapGet("/{idP}", GetTodo);
    mapGroup.MapPost("/", CreateTodo);
    mapGroup.MapPut("/{idP}", UpdateTodo);
    mapGroup.MapDelete("/{idP}", DeleteTodo);

    return mapGroup;
  }

  private async Task<IResult> GetAllTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Select(x => new TodoItemDTO(x)).ToArrayAsync());
  }

  protected async Task<IResult> GetTodayTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems
      .Where(t => t.DateTime.HasValue && t.DateTime.Value.Date == DateTime.Today && !t.IsComplete)
      .Select(x => new TodoItemDTO(x))
      .ToListAsync());
  }

  private async Task<IResult> GetTomorrowTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems
      .Where(t => t.DateTime.HasValue && t.DateTime.Value.Date == DateTime.Today.AddDays(1) && !t.IsComplete)
      .Select(x => new TodoItemDTO(x))
      .ToListAsync());
  }

  private async Task<IResult> GetCompleteTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Where(t => t.IsComplete).Select(x => new TodoItemDTO(x)).ToListAsync());
  }

  private async Task<IResult> GetNotCompleteTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Where(t => !t.IsComplete).Select(x => new TodoItemDTO(x)).ToListAsync());
  }

  private async Task<IResult> GetTodo(int idP, TodoContext dbP)
  {
    return await dbP.TodoItems.FindAsync(idP)
      is TodoItem todoitem
      ? TypedResults.Ok(new TodoItemDTO(todoitem))
      : TypedResults.NotFound();
  }

  private async Task<IResult> CreateTodo(TodoItemDTO todoItemDTOP, TodoContext dbP)
  {
    var todoItem = new TodoItem
    {
      IsComplete = todoItemDTOP.IsComplete,
      Title = todoItemDTOP.Title,
      Description = todoItemDTOP.Description,
      DateTime = todoItemDTOP.getDateTimeObject()
    };

    dbP.TodoItems.Add(todoItem);
    await dbP.SaveChangesAsync();

    todoItemDTOP = new TodoItemDTO(todoItem);

    return TypedResults.Created($"/todoitems/{todoItem.Id}", todoItemDTOP);
  }

  private async Task<IResult> UpdateTodo(int idP, TodoItemDTO todoItemDTOP, TodoContext dbP)
  {
    var todoItem = await dbP.TodoItems.FindAsync(idP);

    if (todoItem is null)
    {
      return TypedResults.NotFound();
    }


    todoItem.Title = todoItemDTOP.Title;
    todoItem.Description = todoItemDTOP.Description;
    todoItem.DateTime = todoItemDTOP.getDateTimeObject();
    todoItem.IsComplete = todoItemDTOP.IsComplete;

    await dbP.SaveChangesAsync();

    return TypedResults.Ok();
  }

  private async Task<IResult> DeleteTodo(int idP, TodoContext dbP)
  {
    if (await dbP.TodoItems.FindAsync(idP) is TodoItem TodoItemP)
    {
      dbP.TodoItems.Remove(TodoItemP);
      await dbP.SaveChangesAsync();
      return TypedResults.Ok();
    }

    return TypedResults.NotFound();
  }
}
