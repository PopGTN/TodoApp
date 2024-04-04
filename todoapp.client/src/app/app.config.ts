import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter, TitleStrategy, withComponentInputBinding} from '@angular/router';
import {routes} from "./app.routes";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {TodoItemService} from "./Core/Services/TodoItem.Service";
import {TitleStrategyService} from "./Core/Services/TitleStrategy.Service";
import {provideHttpClient} from "@angular/common/http";
import {TranslocoHttpLoader} from './transloco-loader';
import {provideTransloco} from '@ngneat/transloco';
import {defaultLang, supportedLanguages} from "./Core/Services/Language.Service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), provideAnimationsAsync(), provideHttpClient(),
    {provide: TitleStrategy, useClass: TitleStrategyService}, {provide: TodoItemService}, provideTransloco({
      config: {
        availableLangs: supportedLanguages,
        defaultLang: defaultLang,
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    })
  ]
};
