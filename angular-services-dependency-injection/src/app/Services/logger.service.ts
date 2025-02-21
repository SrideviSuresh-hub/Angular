import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class LoggerService{
    logMessage(name:string,status:string){
        console.log(`a new user with ${name} withstatus ${status} is added to user list `)
    }
}