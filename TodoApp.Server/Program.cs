using Humanizer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Server.Models;

namespace TodoApp.Server;

public class Program
{
  public static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);
    // Add services to the container.
    //Todo: Remove this line below and remove anything weather related once I get to making the TodoItemP app
    builder.Services.AddControllers();
    var connectionString = builder.Configuration.GetConnectionString("WebApiDatabase");
    builder.Services.AddSqlite<TodoContext>(connectionString);
    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    //Todo: Remove this line below
    builder.Services.AddEndpointsApiExplorer();

    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    RouteGroupBuilder todoItems = app.MapGroup("/TodoItems");

    todoItems.MapGet("/", GetAllTodos);
    todoItems.MapGet("/complete", GetCompleteTodos);
    todoItems.MapGet("/{id}", GetTodo);
    // todoItems.MapPost("/", CreateTodo);
    todoItems.MapPut("/{id}", UpdateTodo);
    todoItems.MapDelete("/{id}", DeleteTodo);


// Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
  }
  static async Task<IResult> GetAllTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Select(x => new TodoItemDTO(x)).ToArrayAsync());
  }

  static async Task<IResult> GetCompleteTodos(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Where(t => t.IsComplete).Select(x => new TodoItemDTO(x)).ToListAsync());
  }

  static async Task<IResult> GetTodo(int id, TodoContext dbP)
  {
    return await dbP.TodoItems.FindAsync(id)
      is TodoItem todoitem
      ? TypedResults.Ok(new TodoItemDTO(todoitem))
      : TypedResults.NotFound();
  }

  // static async Task<IResult> CreateTodo(TodoItem TodoItemP, TodoItemDTO todoItemDTOP, TodoContext dbP)
  // {
  //   var todoItem = new TodoItem
  //   {
  //     IsComplete = todoItemDTOP.IsComplete,
  //     Title = todoItemDTOP.Title,
  //     Description = todoItemDTOP.Description
  //   };
  //
  //   dbP.TodoItems.Add(todoItem);
  //   await dbP.SaveChangesAsync();
  //
  //   todoItemDTOP = new TodoItemDTO(todoItem);
  //
  //   return TypedResults.Created($"/todoitems/{todoItem.Id}", todoItemDTOP);
  // }

  static async Task<IResult> UpdateTodo(int idP, TodoItemDTO todoItemDTOP, TodoContext dbP)
  {
    var todoItem = await dbP.TodoItems.FindAsync(idP);

    if (todoItem is null) return TypedResults.NotFound();

    todoItem.Title = todoItemDTOP.Title;
    todoItem.Description = todoItemDTOP.Description;
    todoItem.DateTime = todoItemDTOP.DateTime;
    todoItem.IsComplete = todoItemDTOP.IsComplete;

    await dbP.SaveChangesAsync();

    return TypedResults.NoContent();
  }

  static async Task<IResult> DeleteTodo(int id, TodoContext dbP)
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
