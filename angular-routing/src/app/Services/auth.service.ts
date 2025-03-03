import { inject, Injectable } from "@angular/core";
import { User } from "../Models/user";
import { UserService } from "./user.service";

@Injectable({
    providedIn:'root'
})
export class AuthService{

    isLogged:boolean=false;
    userService:UserService=inject(UserService);

    login(username:string,password:string){
      let user= this.userService.users.find((val)=>
        val.username===username && val.password===password);
      if(user===undefined){
        this.isLogged=false;
      }
      else{
        this.isLogged=true;
      }
      return user
    }


    logout(){
        this.isLogged=false;
    }

    isAuthenticated(){
        return this.isLogged;
    }

}