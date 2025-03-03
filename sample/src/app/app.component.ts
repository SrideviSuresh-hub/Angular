import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sample';
  reactiveForm:FormGroup;
  ngOnInit(){
    this.reactiveForm=new FormGroup({
      firstname:new FormControl(null,Validators.required),
      lastname:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.email,Validators.required]),
      username:new FormControl(null),
      dob:new FormControl(null),
      gender:new FormControl('female'),
      address:new FormGroup({
      street:new FormControl(null,Validators.required),
      country:new FormControl('India',Validators.required),
      city:new FormControl(null),
      region:new FormControl(null),
      postal:new FormControl(null,Validators.required)
      }),
      skills:new FormArray([
        new FormControl(null,Validators.required),
        // new FormControl(null,Validators.required),
        // new FormControl(null,Validators.required),
      ]),
      experience:new FormArray([
       
      ])
    })
    }
    onSubmit(){
      console.log(this.reactiveForm);
    }
    addSkills(){
      (<FormArray>this.reactiveForm.get('skills')).push(new FormControl(null,Validators.required));
    }
    deleteSkills(index:number){
      let controls=(<FormArray>this.reactiveForm.get('skills'));
      controls.removeAt(index);
    }
    addExp(){
      const formGroup= new FormGroup({
        company:new FormControl(null),
        totExp:new FormControl(null),
        position:new FormControl(null),
        startDate:new FormControl(null),
        endDate:new FormControl(null),
      });
      (<FormArray>this.reactiveForm.get('experience')).push(formGroup)
    }
    delExp(index:number){
        const controls=(<FormArray>this.reactiveForm.get('experience'));
        controls.removeAt(index)
    }
}
