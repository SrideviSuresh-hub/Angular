import { Component, EventEmitter, Input, input, OnInit, Output, viewChild } from '@angular/core';
import { Student } from '../../Models/Student';

@Component({
  selector: 'confirm-delete',
  standalone: false,
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.css'
})
export class ConfirmDeleteComponent implements OnInit {
  constructor(){

  }

  @Input()
  studentToDelete:Student;
@Output()
OnConfirmation:EventEmitter<boolean>=new EventEmitter<boolean>();

  ngOnInit(){
      
  }

  onConfirmClicked(value:boolean){
    this.OnConfirmation.emit(value);
  }
}
