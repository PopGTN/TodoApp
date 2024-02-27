namespace TodoApp.Server.Models;

public class TodoItem
{
  public int Id { get; set; }
  public string TitleP { get; set; }
  public string DescriptionP { get; set; }
  public bool IsComplete { get; set; }
  public DateTime DateTimeP { get; set; }

  public TodoItem(string titleP, string descriptionP, DateTime dateTimeP)
  {
    TitleP = titleP;
    DescriptionP = descriptionP;
    DateTimeP = dateTimeP;
  }

}
