import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Task } from "../Models/task";
import { catchError, exhaustMap, map, Subject, take, tap, throwError } from "rxjs";
import { LoggingService } from "./logging.service";
import { AuthService } from "./auth.service";
import { User } from "../Models/user";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class TaskService {
    http: HttpClient = inject(HttpClient);
    loggingService:LoggingService=inject(LoggingService);
    errorSubject= new Subject<HttpErrorResponse>();
    authService:AuthService=inject(AuthService);

    createTask(task: Task) {
        const headers = new HttpHeaders({ 'my-header': 'hello-word' });
      return   this.http.post('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks.json'
            , task, { headers: headers})
            .pipe(catchError((err)=>
                {
                    const errorObj={statusCode:err.status,errorMessage:err.message, datetime:new Date()}
                    this.loggingService.logErrors(errorObj);
                    return throwError(()=>err);
        
                }))
            .subscribe({error:(err)=>{
                this.errorSubject.next(err);
            }})
    }
    deleteTask(id: string | undefined) {
        this.http.delete('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks/'+ id +'.json')    
        .pipe(catchError((err)=>
            {
                const errorObj={statusCode:err.status,errorMessage:err.message, datetime:new Date()}
                this.loggingService.logErrors(errorObj);
                return throwError(()=>err);
            })).subscribe({error:(err)=>{
                this.errorSubject.next(err);
            }})
    }
    clearAllTasks() {
        this.http.delete('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks.json',{observe:'events',responseType:'json'})
        .pipe(tap((event)=>{
            console.log(event)
            }),catchError((err)=>
            {
                const errorObj={statusCode:err.status,errorMessage:err.message, datetime:new Date()}
                this.loggingService.logErrors(errorObj);
                return throwError(()=>err);
    
            }))
            .subscribe({error:(err)=>{

                this.errorSubject.next(err);
            }})
    }
    fetchAllTasks(){
      return  this.authService.user.pipe(take(1),exhaustMap(user =>{
            return  this.http.get<{[name:string]:Task}>('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks.json',{params:new HttpParams().set('auth',user.token)})
        }),map((task)=>{
            let tasks=[];
            console.log(task);
            for(let key in task){
                if(task.hasOwnProperty(key)){
                    tasks.push({...task[key],id:key})
                }
            }
            return tasks;
    }),catchError((err)=>
    {
        const errorObj={statusCode:err.status,errorMessage:err.message, datetime:new Date()}
        this.loggingService.logErrors(errorObj);
        return throwError(()=>err);
    }))
    // .subscribe((user)=>console.log(user));
        // let headers=new HttpHeaders();
        // headers=headers.append('content-type','application/json');
        // headers=headers.append('content-type','text/html');
        // // headers=headers.append('access-controll-allow-origin','*');
        // let queryParams=new HttpParams();
        // queryParams=queryParams.set('page',2);
        // queryParams=queryParams.set('item',10);
        // // ?page=2&item=10
    //    return  this.http.get<{[name:string]:Task}>('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks.json',
    //     // {headers:headers,params:queryParams,observe:'body'}
    //    ).pipe()
    };
    updateTask(id:string|undefined, data:Task){
       return   this.http.put('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks/'+id+'.json',data)
       .pipe(catchError((err)=>
        {
            const errorObj={statusCode:err.status,errorMessage:err.message, datetime:new Date()}
            this.loggingService.logErrors(errorObj);
            return throwError(()=>err);

        }))
        .subscribe({error:(err)=>{
            this.errorSubject.next(err);
        }});

    }
    getTaskDetail(id:string|undefined){
          return this.http.get('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks/'+id+'.json')
          .pipe(map((resp)=>{
            let task={};
            task={...resp,id:id}
            console.log(resp);
            return task;  
          }))

    }

}