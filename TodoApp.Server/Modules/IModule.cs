﻿namespace TodoApp.Server.Interfaces;

/*This file registers the modules automatically
 Credits
https://timdeschryver.dev/blog/maybe-its-time-to-rethink-our-project-structure-with-dot-net-6#register-the-modules-automatically
 */
public interface IModule
{
  IServiceCollection RegisterModule(IServiceCollection builder);
  IEndpointRouteBuilder MapEndpoints(IEndpointRouteBuilder endpoints);
}

public static class ModuleExtensions
{
  // this could also be added into the DI container
  private static readonly List<IModule> registeredModules = new();

  public static IServiceCollection RegisterModules(this IServiceCollection services)
  {
    var modules = DiscoverModules();
    foreach (var module in modules)
    {
      module.RegisterModule(services);
      registeredModules.Add(module);
    }

    return services;
  }

  public static WebApplication MapEndpoints(this WebApplication app)
  {
    foreach (var module in registeredModules)
    {
      module.MapEndpoints(app);
    }

    return app;
  }

  private static IEnumerable<IModule> DiscoverModules()
  {
    return typeof(IModule).Assembly
      .GetTypes()
      .Where(p => p.IsClass && p.IsAssignableTo(typeof(IModule)))
      .Select(Activator.CreateInstance)
      .Cast<IModule>();
  }
}
