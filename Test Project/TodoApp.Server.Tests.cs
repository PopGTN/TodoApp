using NUnit.Framework;
using FluentAssertions;
using RestSharp;
using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using TodoApp.Server;
using TodoApp.Server.Controllers;
using TodoApp.Server.DTOs;
using System;
using System.Collections.Generic;

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
      Program.TestingMode = true;
      _webAppFactory = new WebApplicationFactory<Program>();
      _httpClient = _webAppFactory.CreateDefaultClient();
    }

    [OneTimeTearDown]
    public void TearDown()
    {
      _httpClient?.Dispose();
      _webAppFactory?.Dispose();
    }

    [Test]
    public async Task get_Todo_List()
    {
      var response = await _httpClient.GetAsync("todoitems");
      response.StatusCode.Should().Be(HttpStatusCode.OK);

      var todoListResults = await response.Content.ReadFromJsonAsync<List<TodoItemDTO>>();
      todoListResults.Should().NotBeNull();
      todoListResults.Should().NotBeEmpty();

      foreach (var todoItemDTO in todoListResults)
      {
        todoItemDTO.Should().NotBeEquivalentTo(new TodoItemDTO(), options => options.ExcludingMissingMembers());
      }
    }

    [Test]
    public async Task get_Completed_TodoList()
    {
      var response = await _httpClient.GetAsync("todoitems/complete");
      response.StatusCode.Should().Be(HttpStatusCode.OK);

      var todoListResults = await response.Content.ReadFromJsonAsync<List<TodoItemDTO>>();
      todoListResults.Should().NotBeNull();
      todoListResults.Should().NotBeEmpty();

      foreach (var todoItemDTO in todoListResults)
      {
        todoItemDTO.Should().NotBeEquivalentTo(new TodoItemDTO(), options => options.ExcludingMissingMembers());
        todoItemDTO.IsComplete.Should().BeTrue();
      }
    }

    [Test]
    public async Task create_and_delete_Todo_Item()
    {
      // Arrange
      var title = "Debugging Todo";
      var description = "This todo is create from the testing Project which is debugging project";
      var isComplete = false;
      var dateTime = DateTime.Today.AddDays(5);
      var todoItem = new TodoItem(title, description, dateTime, isComplete);
      var todoItemDto = new TodoItemDTO(todoItem);

      var settings = new JsonSerializerSettings
      {
        DateParseHandling = DateParseHandling.None // Do not convert dates
      };

      // Act
      var content = new StringContent(JsonConvert.SerializeObject(todoItemDto, settings), Encoding.UTF8,
        "application/json");
      var response = await _httpClient.PostAsync("todoitems", content);
      response.EnsureSuccessStatusCode();

      var result = await response.Content.ReadAsStringAsync();
      var todoItemResult = JsonConvert.DeserializeObject<TodoItemDTO>(result);

      todoItemResult.Should().NotBeNull();
      todoItemResult.Title.Should().Be(title);
      todoItemResult.Description.Should().Be(description);
      todoItemResult.DateTime.Should().Be(dateTime);
      todoItemResult.IsComplete.Should().Be(isComplete);

      // Cleanup
      response = await _httpClient.DeleteAsync($"todoitems/{todoItemResult.Id}");
      response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Test]
    public async Task Get_Todo_Item()
    {
      var response = await _httpClient.GetAsync("todoitems/1");
      response.StatusCode.Should().Be(HttpStatusCode.OK);

      var todoItemResult = await response.Content.ReadFromJsonAsync<TodoItemDTO>();
      todoItemResult.Should().NotBeNull();
      todoItemResult.Id.Should().Be(1);
    }
  }
}
