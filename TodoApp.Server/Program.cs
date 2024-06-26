using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TodoApp.Server.Models;
using TodoApp.Server.Interfaces;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
//Todo: Remove this line below and remove anything weather related once I get to making the TodoItemP app
builder.Services.AddControllers();
//Registers TodoItems Module
builder.Services.RegisterModules();
builder.Services.AddDbContext<TodoContext>(opt =>
  opt.UseSqlite(builder.Configuration.GetConnectionString("WebApiDatabase")));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
//Todo: Remove this line below
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "TodoList Api", Version = "v1" });
});

var app = builder.Build();

//Maps TodoItems Module Endpoints
app.MapEndpoints();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
//TODO: Remove
app.MapControllers();
app.Run();


public partial class Program
{
}
