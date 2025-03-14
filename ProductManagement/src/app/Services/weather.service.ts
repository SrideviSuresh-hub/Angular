import { HttpClient } from "@angular/common/http";
import {  inject, Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class WeatherService{
    apiKey='adfb3fecfce0472cef4775d289373ff9';
    http:HttpClient=inject(HttpClient);
 
    fetchWeather(){
     return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&appid=${this.apiKey}`);
    }
}