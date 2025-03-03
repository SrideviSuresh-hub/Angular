import { Component, inject, OnInit, Input } from '@angular/core';
import { Task } from '../Models/task';
import { HttpClient } from '@angular/common/http';

import { TaskService } from '../Services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  http: HttpClient = inject(HttpClient);
  showCreateTaskForm: boolean = false;
  allTasks: Task[] = [];
  currentTaskId:string='';
  taskService:TaskService=inject(TaskService);
  editMode:boolean=false;
  selectedTask:Task={title:'',desc:'',assignedTo:'',createdAt:'',status:'',priority:''}
  ;

  ngOnInit() {
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
    this.taskService.createTask(task);
    }else{
      this.taskService.updateTask(this.currentTaskId,task);
    } 
  }

  fetchAllTasksClicked() {
    this.fetchAllTasks();
  }

  private fetchAllTasks() {
    this.taskService.fetchAllTasks()
      .subscribe((response) => {
        this.allTasks = response
        console.log(response)
      });
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
}
