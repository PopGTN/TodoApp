import { Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {WeatherExampleComponent} from "./weather-example/weather-example.component";

export const routes: Routes = [
    { path: 'weather', component: WeatherExampleComponent, title: "Weather App" },
    { path: '', redirectTo: '/weather', pathMatch: 'full' }, // redirect to `first-component`
    { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
