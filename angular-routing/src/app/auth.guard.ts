import { inject } from "@angular/core"
import { AuthService } from "./Services/auth.service"
import { Router } from "@angular/router";
import { CourseService } from "./Services/course.service";


export const canActivate=()=>{
    const auth:AuthService=inject(AuthService);
    const  route:Router=inject(Router);
if( auth.isAuthenticated()){
    return true;
}
else{
    route.navigate(['/Login']);
    return false;
}
}

export const canActivateChild=()=>{
    const auth:AuthService=inject(AuthService);
    const  route:Router=inject(Router);
if( auth.isAuthenticated()){
    return true;
}
else{
    route.navigate(['/Login']);
    return false;
}


}
export const resolve=()=>{
   const courseService:CourseService=inject(CourseService);
    return    courseService.getAllCourses();
}