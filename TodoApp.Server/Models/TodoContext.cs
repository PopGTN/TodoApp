using Microsoft.EntityFrameworkCore;

namespace TodoApp.Server.DTOs;

public class TodoContext : DbContext
{

  public DbSet<TodoItem> TodoItems { get; set; }
  public TodoContext(DbContextOptions<TodoContext> optionsP)
    : base(optionsP)
  {
  }

}
