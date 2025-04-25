import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../../Services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: false,
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  weatherData:any;
  temperature:number;
  weathericon:string;
 weatherervice:WeatherService=inject(WeatherService);
  ngOnInit() {
    this.weatherervice.fetchWeather().subscribe({
      next:(data)=>{
        this.weatherData=data;
        this.extractWeatherData()
      }
    })
  }

  extractWeatherData(){
    this.temperature=this.weatherData.main.temp-273.15;
    this.weathericon=`http://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`
  }
}
