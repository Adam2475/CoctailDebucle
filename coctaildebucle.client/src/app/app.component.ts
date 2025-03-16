import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from './ts/button.component'

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './html/app.component.html',
  standalone: false,
  styleUrl: './css/app.component.css'
})

export class AppComponent implements OnInit
{
  public forecasts: WeatherForecast[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit()
  {
    this.getForecasts();
  }

  getForecasts()
  {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  title = 'coctaildebucle.client';
}
