import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { StudentSevice } from '../Services/Student.service';
import { Student } from '../Models/Student';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements  OnInit {
  studentService:StudentSevice=inject(StudentSevice);
  students:Student[];
  totalMarks:number;

  isInserting:boolean=false;
  isEditing:boolean=false;
  stdIdToEdit:number;

  filterText:string='All';
  totalStudents= new Promise((resolve,reject)=>{
    setTimeout(() => {
      resolve(this.students.length)
    }, 2000);
  });

  //prop for inserting
  @ViewChild('name')name:ElementRef;
  @ViewChild('gender')gender:ElementRef;
  @ViewChild('dob')dob:ElementRef;
  @ViewChild('course')course:ElementRef;
  @ViewChild('marks')marks:ElementRef;
  @ViewChild('fee')fee:ElementRef;

  //prop for editing
  @ViewChild('editName')editName:ElementRef;
  @ViewChild('editGender')editGender:ElementRef;
  @ViewChild('editDob')editDob:ElementRef;
  @ViewChild('editCourse')editCourse:ElementRef;
  @ViewChild('editMarks')editMarks:ElementRef;
  @ViewChild('editFee')editFee:ElementRef;

  ngOnInit(){
      this.students=this.studentService.filterStudentByGender(this.filterText);
      this.totalMarks=this.studentService.totalMarks;
  }
  
  onInsertClicked(){
    this.isInserting=true;
  }
  onInsertCancelled(){
    this.isInserting=false;
  }
  onInsertSaved(){
    this.studentService.createStudent(
      this.name.nativeElement.value,
      this.gender.nativeElement.value,
      this.dob.nativeElement.value,
      this.course.nativeElement.value,
      this.marks.nativeElement.value,
      this.fee.nativeElement.value,
    );
    // this.students=this.studentService.students;
    
    this.isInserting=false;
    this.students=this.studentService.filterStudentByGender(this.filterText);
  }
  onEditClicked(stdId:number){
    this.isEditing=true;
    this.stdIdToEdit=stdId
  }
  onEditCancelled(){
    this.isEditing=false;
  }
  onEditSaved(student:Student){
    student.name=this.editName.nativeElement.value;
    student.gender=this.editGender.nativeElement.value;
    student.dob=this.editDob.nativeElement.value;
    student.course=this.editCourse.nativeElement.value;
    student.marks=this.editMarks.nativeElement.value;
    student.fee=this.editFee.nativeElement.value;
    this.isEditing=false;
    this.students=this.studentService.filterStudentByGender(this.filterText);

  }
  onFilterValueChanged(event:any){
   let selectedValue=event.target.value;
   this.filterText=selectedValue;
   this.students=this.studentService.filterStudentByGender(this.filterText);
  }

  showConfirmDelteComp:boolean=false;
  studentToDelete:Student;

  onDeleteClicked(student:Student){
    this.showConfirmDelteComp=true;
    this.studentToDelete=student;
  console.log(student);
}
onUserConfirm(value:boolean){
  this.showConfirmDelteComp=false;
    if(value){
        //delte user
        let index=this.studentService.students.indexOf(this.studentToDelete);
        this.studentService.students.splice(index,1)
    }
   
}
}
