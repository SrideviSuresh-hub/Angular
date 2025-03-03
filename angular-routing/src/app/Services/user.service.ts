import { Injectable } from "@angular/core";
import { User } from "../Models/user";

@Injectable({
    providedIn:'root'
})
export class UserService{

    users:User[]=[
        new User(1,'aa aa','js','12345'),
        new User(2,'bb bb','mj','12345'),
        new User(3,'cc cc','mv','12345'),
        new User(4,'dd dd','sk','12345')
    ]
}