import { HttpClient } from "@angular/common/http";
import {  inject, Injectable } from "@angular/core";
import { AuthResponse } from "../Models/authResponse";
import { catchError, Subject, tap, throwError } from "rxjs";
// import { User } from "../Models/User";

@Injectable({
    providedIn:'root'
})

export class AuthService{

    active:boolean=false;
    http:HttpClient=inject(HttpClient);
    // user=new Subject<User>();
signUp(email,password){
   const postData={
    email:email,
    password:password,
    returnSecureToken:true
   }
   return this.http.post<AuthResponse>(
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
    ,postData).pipe(catchError(this.handleError))

}
login(email,password){
    const data={
        email:email,
        password:password,
        returnSecureToken:true
    }
return  this.http.post<AuthResponse>(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
    ,data).pipe(catchError(this.handleError))
}

handleError(err){
    let errorMessage='An Unknown error occured';
    console.log(err);
    if(!err.error || !err.error.error){
        return throwError(()=>errorMessage)
    }
    switch(err.error.error.message){
        case 'EMAIL_EXISTS':
            errorMessage ="This email already exists.";
            break;
        case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'This operation is not allowed.';
            break;
        case 'INVALID_LOGIN_CREDENTIALS':
            errorMessage = 'The email ID or Password is not correct.';
            break;
    }
    return throwError(()=>errorMessage)

}

}