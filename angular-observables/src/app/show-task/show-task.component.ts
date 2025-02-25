import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../Services/task.service';

@Component({
  selector: 'app-show-task',
  standalone: false,
  templateUrl: './show-task.component.html',
  styleUrl: './show-task.component.css'
})
export class ShowTaskComponent implements OnInit {
  tasks: string[] = ['task1', 'task2', 'task3'];

  taskService: TaskService = inject(TaskService);
  ngOnInit() {
    this.taskService.createTask.subscribe((value) => {
      this.tasks.push(value);
    })
  }

}
