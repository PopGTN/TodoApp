using Humanizer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TodoApp.Server.DTOs;
using TodoApp.Server.Modules;

namespace TodoApp.Server;

public class Program
{
  public static bool TestingMode { set; get; } = false;

  public static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);
    // Add services to the container.
    //Todo: Remove this line below and remove anything weather related once I get to making the TodoItemP app
    builder.Services.AddControllers();
    //Registers TodoItems Module
    builder.Services.RegisterTodoItemsModule();
    var connectionString = builder.Configuration.GetConnectionString("WebApiDatabase");
    var connectionStringDebug = builder.Configuration.GetConnectionString("WebApiDatabase-Debug");

    builder.Services.AddDbContext<TodoContext>(TestingMode
      ? (Action<DbContextOptionsBuilder>)(opt => opt.UseSqlite(connectionStringDebug))
      : (Action<DbContextOptionsBuilder>)(opt => opt.UseSqlite(connectionString)));

    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    //Todo: Remove this line below
    builder.Services.AddEndpointsApiExplorer();

    builder.Services.AddSwaggerGen(c =>
    {
      c.SwaggerDoc("v1", new OpenApiInfo { Title = "TodoList Api", Version = "v1" });
    });

    var app = builder.Build();

    //Maps TodoItems Module Endpoints
    app.MapTodoItemsEndpoints();


    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();
  }
}
