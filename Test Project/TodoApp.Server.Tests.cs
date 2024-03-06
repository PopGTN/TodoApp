using NUnit.Framework;
using FluentAssertions;
using RestSharp;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using TodoApp.Server.DTOs;
using Microsoft.Extensions.Configuration;

namespace TodoApp.Test_Project
{
  [TestFixture]
  public class TodoApiUnitTesting
  {
    private WebApplicationFactory<Program>? _webAppFactory;
    private HttpClient? _httpClient;

    [OneTimeSetUp]
    public void Setup()
    {
      _webAppFactory = new WebApplicationFactory<Program>()
        .WithWebHostBuilder(builder =>
        {
          builder.ConfigureAppConfiguration((context, conf) =>
          {
            conf.AddJsonFile("appsettings.Testing.json");
          });
        });
      _httpClient = _webAppFactory.CreateDefaultClient();
    }

    [OneTimeTearDown]
    public void TearDown()
    {
      _httpClient?.Dispose();
      _webAppFactory?.Dispose();
    }

    [Test]
    public async Task getTodoItemList_ReturnTodoItemList()
    {
      //Act
      var response = await _httpClient.GetAsync("todoitems");
      response.EnsureSuccessStatusCode();
      var todoListResults = await response.Content.ReadFromJsonAsync<List<TodoItemDTO>>();
      //Assert
      todoListResults.Should().NotBeEmpty();
      foreach (var todoItemDTO in todoListResults)
      {
        todoItemDTO.Should().NotBeEquivalentTo(new TodoItemDTO(), options => options.ExcludingMissingMembers());
      }
    }

    [Test]
    public async Task GetTodoList_ReturnsCompletedTodoList()
    {
      //Act
      var response = await _httpClient.GetAsync("todoitems/complete");
      response.StatusCode.Should().Be(HttpStatusCode.OK);
      var todoListResults = await response.Content.ReadFromJsonAsync<List<TodoItemDTO>>();
      //Assert
      todoListResults.Should().NotBeEmpty();
      todoListResults.Should().OnlyContain(todoItem => todoItem.IsComplete);
    }

    [Test]
    public async Task PostTodo_WhenCalledWithValidTodoItem_ReturnsValidTodoItem()
    {
      // Arrange
      var newIncompleteTodoItemDto = new TodoItemDTO
      {
        Title = "Debugging Todo",
        Description = "This todo is create from the testing Project which is debugging project",
        DateTime = DateTime.Today.AddDays(5),
        IsComplete = false
      };
      var settings = new JsonSerializerSettings
      {
        DateParseHandling = DateParseHandling.None // Do not convert dates
      };
      var content = new StringContent(JsonConvert.SerializeObject(newIncompleteTodoItemDto, settings), Encoding.UTF8,
        "application/json");

      // Act
      var response = await _httpClient.PostAsync("todoitems", content);
      response.EnsureSuccessStatusCode();
      var validTodoItem = response.Content.ReadFromJsonAsync<TodoItemDTO>().Result;
      //Assert
      validTodoItem.Should().BeEquivalentTo(newIncompleteTodoItemDto, options => options
        .Excluding(dto => dto.Id));
      // Cleanup
      var deleteResponse = await _httpClient.DeleteAsync($"todoitems/{validTodoItem.Id}");
      deleteResponse.EnsureSuccessStatusCode();
    }

    [Test]
    public async Task GetTodoItem_ReturnsSelectedTodoItem()
    {
      int ListPostion = 0;
      //Arrange
      var TodoListResponse = await _httpClient.GetAsync("todoitems");
      TodoListResponse.EnsureSuccessStatusCode();

      var todoListResults = await TodoListResponse.Content.ReadFromJsonAsync<List<TodoItemDTO>>();


      //Act
      var TodoItemResponse = await _httpClient.GetAsync($"todoitems/{todoListResults[ListPostion].Id}");
      TodoItemResponse.StatusCode.Should().Be(HttpStatusCode.OK);

      //Assert
      var todoItemResult = await TodoItemResponse.Content.ReadFromJsonAsync<TodoItemDTO>();
      todoItemResult.Should().NotBeNull();
      todoItemResult.Id.Should().Be(todoListResults[ListPostion].Id);
    }
  }
}
