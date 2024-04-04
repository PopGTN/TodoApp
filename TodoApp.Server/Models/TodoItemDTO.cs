﻿namespace TodoApp.Server.Models;

public class TodoItemDTO
{
  public int Id { get; set; }
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
  private DateTime? _dateTime;
  public bool IsComplete { get; set; }

  // Custom property to handle serialization/deserialization of DateTime as string
  public string? DateTime
  {
    get
    {
      if (_dateTime != null)
      {
        System.DateTime tempDT = (DateTime)_dateTime;
        tempDT.ToString("yyyy-MM-ddTHH:mm");
        return tempDT.ToString("yyyy-MM-ddTHH:mm");
      }
      else
      {
        return _dateTime.ToString();

      }
    }
    set
    {
      _dateTime = null;
      if (!string.IsNullOrEmpty(value) && System.DateTime.TryParse((string)value, out var parsedDateTime))
      {
        _dateTime = parsedDateTime;
      }
    }
  }

  //Used for the Test Project
  public DateTime? getDateTimeObject()
  {
    return _dateTime;
  }

  //used for the test Project
  public void setDateTimeObject(DateTime dateTime)
  {
    _dateTime = dateTime;
  }

  public TodoItemDTO() { }

  public TodoItemDTO(TodoItem todoItemP)
  {
    Id = todoItemP.Id;
    Title = todoItemP.Title;
    Description = todoItemP.Description;
    IsComplete = todoItemP.IsComplete;
    _dateTime = todoItemP.DateTime;
  }

  public override string ToString()
  {
    return
      $"Id: {Id}, Title: {Title}, Description: {Description}, IsComplete: {IsComplete}, DateTime: {_dateTime.ToString()}";
  }
}
