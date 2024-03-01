global using NUnit.Framework;
global using FluentAssertions;
global using RestSharp;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using NuGet.Protocol;
using TodoApp.Server;
using TodoApp.Server.Controllers;
using TodoApp.Server.DTOs;
using static NUnit.Framework.Assert;


namespace TodoApp.Test_Project;

[TestFixture]
public class TodoAPI_Unit_testing
{
  private int TodoItemToDelete = 0;

  [SetUp]
  public void Setup()
  {
    Program.TestingMode = true;
  }

  [Test]
  public async Task getTodoItemList()
  {
    var webAppFactory = new WebApplicationFactory<Program>();
    var httpClient = webAppFactory.CreateDefaultClient();
    var response = await httpClient.GetAsync("todoitems");
    var result = await response.Content.ReadAsStringAsync();
    /*Converts Json the list of object returned from of the api*/
    if (result.Equals("[]"))
    {
      Warn("The return was empty");
    }
    else
    {
      try
      {
        List<TodoItemDTO>? todoListResults = JsonConvert.DeserializeObject<List<TodoItemDTO>>(result);
        if (todoListResults.Count != 0)
        {
          foreach (var todoItemDTO in todoListResults)
          {
            TodoItemDTO todoItemDTOEmpty = new TodoItemDTO();
            if (todoItemDTO.Equals(todoItemDTOEmpty))
            {
              Fail("There's Empty Entity");
            }
          }
        }
        else
        {
          Fail("Something Went wrong");
        }
      }
      catch (Exception e)
      {
        Console.WriteLine(e.ToString());
        Fail("Failed to convert Json to objects");
      }
    }
    Pass();
  }
  [Test]
  public async Task get_Completed_TodoList()
  {
    var webAppFactory = new WebApplicationFactory<Program>();
    var httpClient = webAppFactory.CreateDefaultClient();
    var response = await httpClient.GetAsync("todoitems/complete");
    var result = await response.Content.ReadAsStringAsync();
    /*Converts Json the list of object returned from of the api*/

    if (result.Equals("[]"))
    {
      Warn("The return was empty");
    }
    else
    {
      try
      {
        List<TodoItemDTO>? todoListResults = JsonConvert.DeserializeObject<List<TodoItemDTO>>(result);
        if (todoListResults.Count != 0)
        {
          foreach (var todoItemDTO in todoListResults)
          {
            TodoItemDTO todoItemDTOEmpty = new TodoItemDTO();
            if (todoItemDTO.Equals(todoItemDTOEmpty))
            {
              Fail("There's Empty Entity");
            }
            if (todoItemDTO.IsComplete == false)
            {
              Fail("There was a todoitem that was not complete \n" + todoItemDTO.ToJson());
            }
          }
        }
        else
        {
          Fail("Something Went wrong");
        }
      }
      catch (Exception e)
      {
        Fail("Failed to convert Json to objects");
      }
    }
    Pass();
  }



  [Test]
  public async Task create_and_delete_Todo_Item()
  {
    //ARRANGE
    var webAppFactory = new WebApplicationFactory<Program>();
    var httpClient = webAppFactory.CreateDefaultClient();
    var title = "Debugging Todo";
    var description = "This todo is create from the testing Project which is debugging project";
    var isComplete = false;
    DateTime dateTime = DateTime.Today.AddDays(5);
    TodoItem todoItem = new TodoItem(title, description, dateTime, isComplete);
    TodoItemDTO todoItemDto = new TodoItemDTO(todoItem);


    // Act
    JsonSerializerSettings settings = new JsonSerializerSettings
    {
      DateParseHandling = DateParseHandling.None, // Do not convert dates
    };
    var content = new StringContent(JsonConvert.SerializeObject(todoItemDto, settings ), Encoding.UTF8, "application/json");
    var response = await httpClient.PostAsync("todoitems", content);
    response.EnsureSuccessStatusCode();
    var result = await response.Content.ReadAsStringAsync();


    TodoItemDTO? todoItemResult = JsonConvert.DeserializeObject<TodoItemDTO>(result);


    if (todoItemResult != null) {
      if (!todoItemResult.Title.Equals(title))
      {
        Fail("Title Doesn't Match"+
             "\n\nOutput Json:\n\n" + todoItemResult.ToJson() +
             "\n\nInput Json:\n\n" + todoItemDto.ToJson() + "\n\n"
        );
      }

      if (!todoItemResult.Description.Equals(description))
      {
        Fail("Description doesn't match"+
             "\n\nOutput Json:\n\n" + todoItemResult.ToJson() +
             "\n\nInput Json:\n\n" + todoItemDto.ToJson() + "\n\n"
        );
      }

      if (!todoItemResult.DateTime.Equals(dateTime))
      {
        Console.WriteLine(todoItemResult.ToJson());
        Console.WriteLine(todoItemDto.ToJson());
        Fail("DateTime doesn't match! " + $"Correct Time: {dateTime}, and theirs {todoItemResult.DateTime}"+
             "\n\nOutput Json:\n\n" + todoItemResult.ToJson() +
             "\n\nInput Json:\n\n" + todoItemDto.ToJson() + "\n\n"
             );
      }

      if (!todoItemResult.IsComplete.Equals(isComplete))
      {
        Fail("IsComplete doesn't match"+
             "\n\nOutput Json:\n\n" + todoItemResult.ToJson() +
             "\n\nInput Json:\n\n" + todoItemDto.ToJson() + "\n\n"
        );
      }
    }

    webAppFactory = new WebApplicationFactory<Program>();
    httpClient = webAppFactory.CreateDefaultClient();
    response = await httpClient.DeleteAsync($"todoitems/{todoItemResult.Id}");
    result = await response.Content.ReadAsStringAsync();
    if (response.StatusCode != HttpStatusCode.OK)
    {
      Fail("API Failed to Delete this object \n\n" + result +
           "\n\nOutput Json:\n\n" + todoItemResult.ToJson() +
           "\n\nInput Json:\n\n" + todoItemDto.ToJson() + "\n\n");
    }

    Pass();
  }

  [Test]
  public async Task Get_Todo_Item()
  {
    var webAppFactory = new WebApplicationFactory<Program>();
    var httpClient = webAppFactory.CreateDefaultClient();
    var response = await httpClient.GetAsync("todoitems/1");
    var result = await response.Content.ReadAsStringAsync();
    if (response.StatusCode != HttpStatusCode.OK)
    {
      Fail($"API Failed to Grab this object \n Status Code {response.StatusCode} \n\n" + result);
    }
  }
}
