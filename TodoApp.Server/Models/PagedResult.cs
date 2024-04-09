namespace TodoApp.Server.Models;

public class PagedResult<T>
{
  public IEnumerable<T> Items { get; set; }
  public APIMetadata Metadata { get; set; }

  public PagedResult(IEnumerable<T> items, APIMetadata metadata)
  {
    Items = items;
    Metadata = metadata;
  }
}
