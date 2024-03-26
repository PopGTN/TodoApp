import {Routes} from "@angular/router";
import {PageNotFoundComponent} from "./ViewModels/page-not-found/page-not-found.component";
import {MainComponent} from "./ViewModels/main/main.component";
import {TodoListComponent} from "./ViewModels/todo-list/todo-list.component";
import {Component} from "@angular/core";
import {AppComponent} from "./app.component";
import {AboutComponent} from "./ViewModels/about/about.component";


export const routes: Routes = [

  {path: '', component: MainComponent, title: "Home",
    children: [
      {path: '', title: "", component: TodoListComponent, },
      {path: 'about', title: "About", component: AboutComponent, }
    ],
  },
  {path: '**', component: PageNotFoundComponent},  // Wildcard route for a 404 page

];
