import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WeatherExampleComponent} from "./weather-example/weather-example.component";

const routes: Routes = [{
  path: 'weather',
  component: WeatherExampleComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
