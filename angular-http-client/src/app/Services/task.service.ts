import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Task } from "../Models/task";
import { map, Observable } from "rxjs";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class TaskService {
    http: HttpClient = inject(HttpClient);

    createTask(task: Task) {
        const headers = new HttpHeaders({ 'my-header': 'hello-word' });
        this.http.post('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks.json'
            , task, { headers: headers })
            .subscribe((response) => {
                console.log(response)
            })
    }
    deleteTask(id: string | undefined) {
        this.http.delete('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks' + id + '.json')
            .subscribe((resp) => {
                console.log(resp);
            })
    }
    clearAllTasks() {
        this.http.delete('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks.json')
            .subscribe(() => {

            })
    }
    fetchAllTasks(){
       return  this.http.get<{[name:string]:Task}>('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks.json')
        .pipe(map((task)=>{
                let tasks=[];
                for(let key in task){
                    if(task.hasOwnProperty(key)){
                        tasks.push({...task[key],id:key})
                    }
                }
                return tasks;
        }))
    }
    updateTask(id:string|undefined, data:Task){
         this.http.put('https://angularhttpclient-c3ed7-default-rtdb.firebaseio.com/tasks/'+id+'.json',data)
        .subscribe();

    }

}