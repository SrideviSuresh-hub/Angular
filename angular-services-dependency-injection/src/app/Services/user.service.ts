
import { EventEmitter, Injectable } from "@angular/core";
import { User } from "../Models/User";
import { LoggerService } from "./logger.service";

@Injectable({
    providedIn:'root'// provide service  from app module
})
export class UserService{
    users:User[]=[
        new User('steve','male','monthly','active'),
        new User('Mark Tyler', 'male','quaterly','inactive'),
        new User('Mery Jane','female','yearly','inactive')
    ];
    constructor(private log:LoggerService){}

    onUserDetailsClicked: EventEmitter<User> =new EventEmitter<User>();
    
    onShowuserDetails(user:User){
       this.onUserDetailsClicked.emit(user);
    }
    getAllUsers(){
        return this.users;
    }

    createUser(name:string,gender:string,subType:string,status:string){
        let user=new User(name,gender,subType,status);
        this.users.push(user);
        this.log.logMessage(name,status);
    }

}