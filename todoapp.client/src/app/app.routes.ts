import {HomeComponent} from "./ViewModels/home/home.component";
import {Routes} from "@angular/router";
import {PageNotFoundComponent} from "./ViewModels/page-not-found/page-not-found.component";
import {MainComponent} from "./ViewModels/main/main.component";
import {WeatherExampleComponent} from "./ViewModels/weather-example/weather-example.component";


export const routes: Routes = [
  // {path: '', component: HomeComponent, title: "First"},
  {path: '', component: MainComponent, title: "Main",
    children: [
      {path: '', title: "Home", component: HomeComponent},
    ],
  },
  {path: 'weather', title: "Weather", component: WeatherExampleComponent},
  {path: '**', component: PageNotFoundComponent},  // Wildcard route for a 404 page
];
