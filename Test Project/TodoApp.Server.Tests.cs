using System.Diagnostics;
using System.Globalization;
using NUnit.Framework;
using FluentAssertions;
using RestSharp;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using TodoApp.Server.Models;

namespace TodoApp.Test_Project;

[TestFixture]
public class TodoApiUnitTesting
{
  private WebApplicationFactory<Program>? _webAppFactory;
  private HttpClient? _httpClient;
  private ITodoApi? _todoApi;


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
    _todoApi = RestService.For<ITodoApi>(_httpClient);
  }


  [OneTimeTearDown]
  public void TearDown()
  {
    _httpClient?.Dispose();
    _webAppFactory?.Dispose();
  }

  [Test]
  public async Task GetTodoItemList_WhenCalled_ReturnsTodoItemList()
  {
    //Act
    var todoListResults = await _todoApi.GetAllTodoItemsAsync();
    //Assert
    todoListResults.Should().NotBeEmpty();
  }

  [Test]
  public async Task GetCompletedTodoItems_WhenCalled_ReturnsOnlyCompletedItems()
  {
    //Act
    var todoListResults = await _todoApi.GetCompletedTodoItemsAsync();
    //Assert
    todoListResults.Should().NotBeEmpty();
    todoListResults.Should().OnlyContain(todoItem => todoItem.IsComplete);
  }

  [Test]
  public async Task GetNotCompletedTodoItems_WhenCalled_ReturnsOnlyNotCompletedItems()
  {
    //Act

    var todoListResults = await _todoApi.GetNotCompletedTodoItemsAsync();
    ;
    //Assert
    todoListResults.Should().NotBeEmpty();
    todoListResults.Should().OnlyContain(todoItem => !todoItem.IsComplete);
  }

  [Test]
  public async Task PostTodo_WhenCalledWithValidTodoItem_ReturnsValidTodoItem()
  {
    // Arrange
    var newIncompleteTodoItemDto = new TodoItemDTO
    {
      Title = "Debugging Todo",
      Description = "This todo is create from the testing Project which is debugging project",
      DateTime = DateTime.Today.AddDays(5).ToString(), //this tests if the Convertion of the datetime object works
      IsComplete = false
    };


    var validTodoItem = await _todoApi.PostTodoItemAsync(newIncompleteTodoItemDto);
    //Assert
    validTodoItem.Should().BeEquivalentTo(newIncompleteTodoItemDto, options => options
      .Excluding(dto => dto.Id));

    // Cleanup
    await _todoApi.DeleteTodoItemAsync(validTodoItem.Id);
  }

  [Test]
  public async Task PostTodoWithNoDAte_WhenCalledWithValidTodoItem_ReturnsValidTodoItem()
  {
    //Arrange
    var newIncompleteTodoItemDto = new TodoItemDTO
    {
      Title = "Debugging Todo",
      Description = "This todo is create from the testing Project which is debugging project",
      IsComplete = false
    };

    // Act
    var validTodoItem = await _todoApi.PostTodoItemAsync(newIncompleteTodoItemDto);
    //Assert
    validTodoItem.Should().BeEquivalentTo(newIncompleteTodoItemDto, options => options
      .Excluding(dto => dto.Id));

    // Cleanup
    await _todoApi.DeleteTodoItemAsync(validTodoItem.Id);
  }

  [Test]
  public async Task GetTodoItem_WhenCalledWithValidId_ReturnsSpecificTodoItem()
  {
    var ListPostion = 0;
    //Act
    var todoListResults = await _todoApi.GetAllTodoItemsAsync();
    var todoItemResult = await _todoApi.GetTodoItemAsync(todoListResults[ListPostion].Id);
    //Assert
    todoItemResult.Should().NotBeNull();
    todoItemResult.Id.Should().Be(todoListResults[ListPostion].Id);
  }

  [Test]
  public async Task PostTodoforTommorrow_OnceUploadedGetTodoysTodo_ReturnsTommorrowsTodoItem()
  {
    // Arrange
    var newIncompleteTodoItemDto = new TodoItemDTO
    {
      Title = "Debugging Todo",
      Description = "This todo is create from the testing Project which is debugging project",
      IsComplete = false
    };
    newIncompleteTodoItemDto.setDateTimeObject(DateTime.Today.AddDays(1));
    // Act
    var TempTodoItem = await _todoApi.PostTodoItemAsync(newIncompleteTodoItemDto);
    TempTodoItem.Should().BeEquivalentTo(newIncompleteTodoItemDto, options => options
      .Excluding(dto => dto.Id));
    var todoListResults = await _todoApi.GetTommorrowsTodoItemsAsync();
    // Assert
    TempTodoItem.Should().BeEquivalentTo(newIncompleteTodoItemDto, options => options.Excluding(dto => dto.Id));

    // Cleanup
    await _todoApi.DeleteTodoItemAsync(TempTodoItem.Id);
  }
}
