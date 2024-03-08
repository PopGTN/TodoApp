import {ApplicationConfig} from '@angular/core';
import {provideRouter, TitleStrategy, withComponentInputBinding} from '@angular/router';
import {routes} from "./app.routes";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {TodoItemService} from "./Core/Services/TodoItem.Service";
import {TitleStrategyService} from "./Core/Services/TitleStrategy.Service";
import {provideHttpClient} from "@angular/common/http";


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), provideAnimationsAsync(), provideHttpClient(),
    {provide: TitleStrategy, useClass: TitleStrategyService}, {provide: TodoItemService},
  ]
};
