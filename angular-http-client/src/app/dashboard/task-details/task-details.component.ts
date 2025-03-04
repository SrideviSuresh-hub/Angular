import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { Task } from '../../Models/task';

@Component({
  selector: 'app-task-details',
  standalone: false,
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
   @Output() closeDetailView:EventEmitter<boolean>=new EventEmitter<boolean>();

   @Input() currentTask:Task|null=null;
   
   taskService:TaskService=inject(TaskService);
    onCloseDetail(){
      this.closeDetailView.emit(false);
    }
  
   
}
