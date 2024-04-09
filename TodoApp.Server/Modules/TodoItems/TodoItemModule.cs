using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
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
    mapGroup.MapGet("/{idP}", GetTodo);
    mapGroup.MapPost("/", CreateTodo);
    mapGroup.MapPut("/{idP}", UpdateTodo);
    mapGroup.MapDelete("/{idP}", DeleteTodo);
    mapGroup.MapGet("/", async (HttpContext context) =>
    {
      return await GetAllTodos(context.RequestServices.GetRequiredService<TodoContext>(), context);
    });

    return mapGroup;
  }

  /*Og = Orginal Mean this is the orginal getEnpoint. This is to insure backwards compatability*/
  private async Task<IResult> GetAllTodosOg(TodoContext dbP)
  {
    return TypedResults.Ok(await dbP.TodoItems.Select(x => new TodoItemDTO(x)).ToArrayAsync());
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


  private async Task<IResult> GetAllTodos(TodoContext dbP, HttpContext contextP)
  {
    var orderBy = "";
    var pageSize = 10;
    var pageNumber = 1;
    var orderByDirection = "asc";
    var filter = "none";
    var totalCount = 0;
    var totalPages = 0;
    StringValues searchTerms;
    List<TodoItemDTO> todos;
    IQueryable<TodoItem> query = dbP.TodoItems;

    //Check if orderBy was given
    if (contextP.Request.Query.ContainsKey("direction"))
    {
      //Sets direction of how its ordered if givin
      orderByDirection = contextP.Request.Query["direction"];
    }

    //set what to order everything by if it's given
    if (contextP.Request.Query.ContainsKey("orderBy"))
    {
      //Sets the order by attribute of how its ordered if givin
      orderBy = contextP.Request.Query["orderBy"];
    }

    //sets what filter to use if given
    if (contextP.Request.Query.ContainsKey("filter"))
    {
      //Sets the filter to use if givin
      filter = contextP.Request.Query["filter"];
    }
    if (contextP.Request.Query.ContainsKey("search"))
    {
      //Sets direction of how its ordered if givin
      searchTerms = contextP.Request.Query["search"];
    }

    if (orderByDirection != null || orderBy != null)
    {
      switch (orderBy.ToLower())
      {
        default:
          query = ApplyOrder(orderByDirection, query, t => t.Id);
          break;
        case "title":
          query = ApplyOrder(orderByDirection, query, t => t.Title);
          break;
        case "description":
          query = ApplyOrder(orderByDirection, query, t => t.Description);
          break;
        case "iscomplete":
          query = ApplyOrder(orderByDirection, query, t => t.IsComplete);
          break;
        case "datetime":
          query = ApplyOrder(orderByDirection, query, t => t.DateTime);
          break;
      }
    }

    //Checks if there is a page number or size given
    if (contextP.Request.Query.ContainsKey("page") || contextP.Request.Query.ContainsKey("size"))
    {
      if (contextP.Request.Query.ContainsKey("size"))
      {
        pageSize = Convert.ToInt32(contextP.Request.Query["size"]);
      }

      if (contextP.Request.Query.ContainsKey("page"))
      {
        pageNumber = Convert.ToInt32(contextP.Request.Query["page"]);
      }

      query = query.Skip((pageNumber - 1) * pageSize);
      query = query.Take(pageSize);
      //Does The math for the paginationMetadata
      totalCount = await dbP.TodoItems.CountAsync();
      totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
    }

    switch (filter.ToLower())
    {
      case "uncompleted":
        todos = await query.Where(t => !t.IsComplete).Select(x => new TodoItemDTO(x)).ToListAsync();
        break;
      case "completed":
        todos = await query.Where(t => t.IsComplete).Select(x => new TodoItemDTO(x)).ToListAsync();
        break;
      case "todays":
        todos = await query
          .Where(t => t.DateTime.HasValue && t.DateTime.Value.Date == DateTime.Today && !t.IsComplete)
          .Select(x => new TodoItemDTO(x))
          .ToListAsync();
        break;
      case "tomorrows":
        todos = await query
          .Where(t => t.DateTime.HasValue && t.DateTime.Value.Date == DateTime.Today.AddDays(1) && !t.IsComplete)
          .Select(x => new TodoItemDTO(x))
          .ToListAsync();
        break;
      default:
        filter = "none";
        todos = await query
          .Select(x => new TodoItemDTO(x))
          .ToListAsync();
        break;
    }

    //returns meta date if its a page request else return no metadata
    if (contextP.Request.Query.ContainsKey("page") || contextP.Request.Query.ContainsKey("size"))
    {
      var paginationMetadata = new APIMetadata
      {
        TotalCount = totalCount,
        PageSize = pageSize,
        CurrentPage = pageNumber,
        TotalPages = totalPages,
        Filter = filter
      };
      return TypedResults.Ok(new PagedResult<TodoItemDTO>(todos, paginationMetadata));
    }

    return TypedResults.Ok(todos);
  }

  private IQueryable<TodoItem> ApplyOrder<T>(String direction, IQueryable<TodoItem> query,
    Expression<Func<TodoItem, T>> orderByExpression)
  {
    if (direction.IsNullOrEmpty() && (direction.ToLower() == "desc" || direction.ToLower() == "descending"))
    {
      return query.OrderByDescending(orderByExpression);
    }

    return query.OrderBy(orderByExpression);
  }
}
