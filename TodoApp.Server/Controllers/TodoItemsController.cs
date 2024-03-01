using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Server.Models;

namespace TodoApp.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TodoItemsController : ControllerBase
{
  private readonly TodoContext _contextP;

  public TodoItemsController(TodoContext contextP)
  {
    _contextP = contextP;
  }

  // GET: api/TodoItems
  [HttpGet]
  public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
  {
    return await _contextP.TodoItems.ToListAsync();
  }

  // GET: api/TodoItems/5
  [HttpGet("{idP}")]
  public async Task<ActionResult<TodoItem>> GetTodoItem(int idP)
  {
    var todoItem = await _contextP.TodoItems.FindAsync(idP);

    if (todoItem == null)
    {
      return NotFound();
    }

    return todoItem;
  }

  // PUT: api/TodoItems/5
  // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
  [HttpPut("{idP}")]
  public async Task<IActionResult> PutTodoItem(int idP, TodoItem todoItemP)
  {
    if (idP != todoItemP.Id)
    {
      return BadRequest();
    }

    _contextP.Entry(todoItemP).State = EntityState.Modified;

    try
    {
      await _contextP.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
      if (!TodoItemExists(idP))
      {
        return NotFound();
      }
      else
      {
        throw;
      }
    }

    return NoContent();
  }

  // POST: api/TodoItems
  // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
  [HttpPost]
  public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItemP)
  {
    _contextP.TodoItems.Add(todoItemP);
    await _contextP.SaveChangesAsync();

    return CreatedAtAction(nameof(GetTodoItem), new { id = todoItemP.Id }, todoItemP);
  }

  // DELETE: api/TodoItems/5
  [HttpDelete("{idP}")]
  public async Task<IActionResult> DeleteTodoItem(int idP)
  {
    var todoItemP = await _contextP.TodoItems.FindAsync(idP);
    if (todoItemP == null)
    {
      return NotFound();
    }

    _contextP.TodoItems.Remove(todoItemP);
    await _contextP.SaveChangesAsync();

    return NoContent();
  }

  private bool TodoItemExists(int idP)
  {
    return _contextP.TodoItems.Any(e => e.Id == idP);
  }
}
