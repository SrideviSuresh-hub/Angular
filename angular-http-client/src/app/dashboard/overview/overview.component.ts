import { Component, inject, OnInit, Input } from '@angular/core';
import { Task } from '../../Models/task';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { TaskService } from '../../Services/task.service';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent  implements OnInit{
  http: HttpClient = inject(HttpClient);
  showCreateTaskForm: boolean = false;
  taskDetails:boolean=false;
  allTasks: Task[] = [];
  currentTaskId:string='';
  taskService:TaskService=inject(TaskService);
  editMode:boolean=false;
  isLoading:boolean=false;
  selectedTask:Task={title:'',desc:'',assignedTo:'',createdAt:'',status:'',priority:''};
  errorMsg:string|null=null;
  errorSub:Subscription;
  currentTask:Task|null=null;

  ngOnInit() {
    this.errorSub=this.taskService.errorSubject.subscribe({next:
      (httpError)=>{
        this.setErrorMsg(httpError)
      }
    });
    this.fetchAllTasks();
  }
  closeCreateTaskForm() {
    this.showCreateTaskForm = false;
  }
  openCreateTaskForm() {
    this.editMode=false;
    this.showCreateTaskForm = true;
    this.selectedTask={title:'',desc:'',assignedTo:'',createdAt:'',status:'',priority:''}
  };
  
  createUpdateTask(task:Task) {
    if(!this.editMode){
    this.taskService.createTask(task)
  //   .subscribe({next:(response) => {
  //     console.log(response)
  // },error:(error)=>{
  //   console.log(error);
  // }});
    }else{
      this.taskService.updateTask(this.currentTaskId,task)
  // .subscribe({next:(response) => {
  //       console.log(response)
  // },error:(error)=>{
  //   console.log(error);
  //   }});;
    } 
  }

  fetchAllTasksClicked() {
    this.fetchAllTasks();
  }

  private fetchAllTasks() {
    this.isLoading=true;
    this.taskService.fetchAllTasks()
      .subscribe({next:(response) => {
        this.allTasks = response
        this.isLoading=false;
      },error:(error)=>{
        this.isLoading=false;
        // this.errorMsg=error.message;
        this.setErrorMsg(error);
        
      }});
  }

  private setErrorMsg(err:HttpErrorResponse){
    // console.log(err)
    if(err.error.error==='Permission denied')
    {
      this.errorMsg='you dont have permission to perform this action'
    }
    else{
      this.errorMsg=err.message;
    }
    setTimeout(() => {
      this.errorMsg=null
    }, 3000);
  }
  deleteTask(id: string | undefined) {
    this.taskService.deleteTask(id);
  }

  clearAllTasks() {
   this.taskService.clearAllTasks();
  }
 
  editTask(id:string| undefined){
    this.currentTaskId=id;
    this.showCreateTaskForm=true;
    this.editMode=true;
       this.selectedTask=this.allTasks.find((task)=>{
        return  task.id===id
       })
  }
  showCurTaskDetails(id:string|undefined){
    this.taskDetails=true;
    this.taskService.getTaskDetail(id).subscribe({next:(data:Task)=>{
      this.currentTask=data;
    }});
  }
  closeDetailView(){
    this.taskDetails=false;

  }
  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }
}
