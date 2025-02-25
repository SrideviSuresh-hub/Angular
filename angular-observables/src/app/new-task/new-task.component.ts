import { Component, inject } from '@angular/core';
import { TaskService } from '../Services/task.service';

@Component({
  selector: 'app-new-task',
  standalone: false,
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
newTask:string='';

taskService:TaskService=inject(TaskService);

onCreateTask(){
 console.log(this.newTask);
 this.taskService.onCreateTask(this.newTask);
}
}
