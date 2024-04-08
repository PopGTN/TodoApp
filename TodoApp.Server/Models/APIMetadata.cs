namespace TodoApp.Server.Models;

public class APIMetadata
{
  public int TotalCount { get; set; }
  public int PageSize { get; set; }
  public int CurrentPage { get; set; }
  public int TotalPages { get; set; }
  public string Filter { get; set; }
}
