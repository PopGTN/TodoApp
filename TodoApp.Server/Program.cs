using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using TodoApp.Server.DTOs;
using TodoApp.Server.Interfaces;

var builder = WebApplication.CreateBuilder(args);
//Registers All the Modules
builder.Services.RegisterModules();
builder.Services.AddDbContext<TodoContext>(opt => opt.UseSqlite(builder.Configuration.GetConnectionString("WebApiDatabase")));
builder.Services.AddEndpointsApiExplorer();
var app = builder.Build();
//Maps TodoItems Module Endpoints
app.MapEndpoints();
//Forces Https to keep people looking at the information being sent and recieved
app.UseHttpsRedirection();
app.Run();

public partial class Program { }

