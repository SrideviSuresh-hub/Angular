import { inject, Pipe, PipeTransform } from "@angular/core";
import { Student } from "../app/Models/Student";
import { StudentSevice } from "../app/Services/Student.service";


@Pipe({
    name: 'filter',
    standalone: false,
    pure:false

})
export class FilterPipe implements PipeTransform {
    studentService: StudentSevice = inject(StudentSevice);


    transform(list: Student[], filterBy:string) {
            if(filterBy.toLowerCase() === 'all' || filterBy===''|| list.length===0){
                console.log('filter called');
                return list;
            }
            else{
                return list.filter((std)=>
                    { return std.gender.toLowerCase()=== filterBy.toLowerCase();
                        console.log('filter called');

                }
        )
           }
    }
}