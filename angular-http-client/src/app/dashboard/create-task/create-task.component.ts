import { AfterViewInit, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../Models/task';
import { CounterService } from '../../Services/counter.service';

@Component({
  selector: 'app-create-task',
  standalone: false,
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements AfterViewInit {
  @Input() isEditMode: boolean = false;
  @Input() selectedTask:Task;
  @ViewChild('taskForm')taskForm:NgForm;
  @Output() CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() emitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  counterService:CounterService=inject(CounterService);
  ngOnInit(){
    this.counterService.increment('CreateTaskComponent')
  }
  ngAfterViewInit() {
    setTimeout(()=>
    {
      console.log(this.taskForm.value);
    this.taskForm.form.patchValue(this.selectedTask),0});

  }
  onFormSubmit(form:NgForm) {
    this.emitTaskData.emit(form.value);
    console.log(form.value);
    this.CloseForm.emit(false);
  }

  onCloseForm() {
    this.CloseForm.emit(false);
  
  }
}
