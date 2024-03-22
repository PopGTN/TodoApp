import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter, TitleStrategy, withComponentInputBinding} from '@angular/router';
import {routes} from "./app.routes";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {TodoItemService} from "./Core/Services/TodoItem.Service";
import {TitleStrategyService} from "./Core/Services/TitleStrategy.Service";
import {provideHttpClient} from "@angular/common/http";
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), provideAnimationsAsync(), provideHttpClient(),
    {provide: TitleStrategy, useClass: TitleStrategyService}, {provide: TodoItemService}, provideTransloco({
        config: {
          availableLangs: ['en', 'fr'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }), provideHttpClient(), provideTransloco({
        config: { 
          availableLangs: ['en', 'fr'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }), provideHttpClient(), provideTransloco({
        config: { 
          availableLangs: ['en', 'es'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }),
  ]
};
