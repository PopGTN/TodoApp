namespace TodoApp.Server.Models;

public class TodoItem
{
  public int Id { get; set; }
  public string Title { get; set; }
  public string Description { get; set; }
  public bool IsComplete { get; set; }
  public DateTime? DateTime { get; set; }

  public override string ToString()
  {
    return $"Id: {Id}, Title: {Title}, Description: {Description}, IsComplete: {IsComplete}, DateTime: {DateTime}";
  }
}
