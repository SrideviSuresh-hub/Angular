import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, GuardResult, MaybeAsync, RedirectCommand, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { Course } from "../Models/course";
import { CourseService } from "./course.service";
// import { ContactComponent } from "../contact/contact.component";

export interface IDeactivateComponent{
    canExit:()=>boolean|Observable<boolean>|Promise<boolean>
}


@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanDeactivate<IDeactivateComponent>, Resolve<Course[]> {
    router: Router = inject(Router);
    authService: AuthService = inject(AuthService);
    courseService:CourseService=inject(CourseService);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
        if (this.authService.isAuthenticated()) {
            return true;
        }
        else {
            this.router.navigate(['Login'])
            return false;

        }
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state)
    }

    canDeactivate(component: IDeactivateComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
        return component.canExit();
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
      Course[] |Observable<Course[]> | Promise<Course[]>{
    //     let courseList:Course[]=[];
    //     this.courseService.getAllCourses().subscribe((courses:Course[])=>{
    //         courseList=courses;
    //     })
    //     return courseList;
    return this.courseService.getAllCourses();
    }

    
}