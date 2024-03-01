namespace TodoApp.Server.Models;

public class TodoItem
{
  public int Id { get; set; }
  public string? Title { get; set; }
  public string? Description { get; set; }
  public bool IsComplete { get; set; }
  public DateTime DateTime { get; set; }

  public TodoItem(string? titleP, string? descriptionP, DateTime dateTimeP, bool isCompleteP = false)
  {
    Title = titleP;
    Description = descriptionP;
    DateTime = dateTimeP;
    IsComplete = isCompleteP;
  }

  public TodoItem(string? titleP, string? descriptionP, DateTime dateTimeP)
  {
    Title = titleP;
    Description = descriptionP;
    DateTime = dateTimeP;
  }

  public TodoItem() { }

  public override string ToString()
  {
    return $"Id: {Id}, Title: {Title}, Description: {Description}, IsComplete: {IsComplete}, DateTime: {DateTime}";
  }
}
