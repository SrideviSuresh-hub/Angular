import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class LoggingService{
    http:HttpClient=inject(HttpClient);
    logErrors(data:{statusCode:string,errorMessage:string, datetime:Date}){
        this.http.post('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/log.json',data)
        .subscribe();
    }
    fetchErrors(){
        this.http.get('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/log.json')
        .subscribe((data)=>{
            console.log(data)
        })

    }
}