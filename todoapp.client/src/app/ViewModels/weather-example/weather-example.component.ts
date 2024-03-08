import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {NgForOf, NgIf} from "@angular/common";
interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-weather-example',
  templateUrl: 'weather-example.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrl: './weather-example.component.css'
})
export class WeatherExampleComponent {
  public forecasts: WeatherForecast[] = [];
  Title = "Weather App"
  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.getForecasts();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'todoapp.client';
}
