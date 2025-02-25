import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../Services/task.service';

@Component({
  selector: 'app-sample',
  standalone: false,
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.css'
})
export class SampleComponent  implements OnInit{

  tasks:string[]=['task1'];

  taskService:TaskService=inject(TaskService);
  ngOnInit(){
      this.taskService.createTask.subscribe((value)=>{
          this.tasks.push(value);
      })
  }

}
