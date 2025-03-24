

import { HttpClient } from "@angular/common/http";
import {  inject, Injectable } from "@angular/core";
import { AuthResponse } from "../Models/authResponse";
import { catchError, map, Observable, Subject, switchMap, tap, throwError } from "rxjs";
import {  Router } from "@angular/router";
// import { User } from "../Models/User";

@Injectable({
    providedIn:'root'
})

export class AuthService{
    router:Router=inject(Router);
    http:HttpClient=inject(HttpClient);
    private baseUrluser='https://assignment-a22f7-default-rtdb.firebaseio.com/user';

signUp(user:any):Observable<any>{
      return this.http.post(`${this.baseUrluser}.json`,user);
}


getUserByUserName(username:string){
    return this.http.get<{[key:string]:any}>(`${this.baseUrluser}.json`).pipe(
        map(data=>{
            if(!data) return null;
            const users=Object.keys(data).map(key=>({id:key, ...data[key]}));
            return users.find(u=>u.userName==username )||null;
        }),
        catchError(()=>throwError(()=>"error fetching user")));
}


login(email:string,password:string):Observable<any>{
    return this.http.get<{[key:string]:any}>(`${this.baseUrluser}.json`).pipe(
        map((data)=>{
            if(data){
                // console.log((data));
                // console.log(Object.keys(data));
                // console.log(Object.values(data))
                const users=Object.keys(data).map(key=>({id:key, ...data[key]}));
                const user=users.find(u=>u.email===email && u.password===password);
                return user|| null;
            }
            return null;
        }),
        tap(user=>{
            if(user){
                localStorage.setItem('user',JSON.stringify(user));
            }
        
        })
    )
}

logout(){
    localStorage.removeItem('user');
    this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
}

getCurrentUser():any{
    return JSON.parse(localStorage.getItem('user')||null);
}

isAdmin():boolean{
    const user=this.getCurrentUser();
    if(user){
        return user.isAdmin;
    }
    return false;
}

isLoggedIn():boolean{
    console.log(!!this.getCurrentUser());
    return !!this.getCurrentUser();
}

autoLogout(expirationTime: number) {
    setTimeout(() => {
      this.logout();
    }, expirationTime);
  }
}

















    // user=new Subject<User>();
// signUp(email,password){
//    const postData={
//     email:email,
//     password:password,
//     returnSecureToken:true
//    }
//    return this.http.post<AuthResponse>(
//     'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
//     ,postData).pipe(catchError(this.handleError))
// }
// login(email,password){
//     const data={
//         email:email,
//         password:password,
//         returnSecureToken:true
//     }
// return  this.http.post<AuthResponse>(
//     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDKLjlRJW1wIEgAuyRPTedfUTUBDRK03SE'
//     ,data).pipe(catchError(this.handleError))
// }


// handleError(err){
//     let errorMessage='An Unknown error occured';
//     console.log(err);
//     if(!err.error || !err.error.error){
//         return throwError(()=>errorMessage)
//     }
//     switch(err.error.error.message){
//         case 'EMAIL_EXISTS':
//             errorMessage ="This email already exists.";
//             break;
//         case 'OPERATION_NOT_ALLOWED':
//             errorMessage = 'This operation is not allowed.';
//             break;
//         case 'INVALID_LOGIN_CREDENTIALS':
//             errorMessage = 'The email ID or Password is not correct.';
//             break;
//     }
//     return throwError(()=>errorMessage)

// }




