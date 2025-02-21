import { Injectable, InjectionToken } from "@angular/core";

@Injectable()
export class SubscribeService{
// export subscribeSevice= new InjectionToken<SubscribeService>();

    onSubscribeClicked(type:string){
        //add user to db
    
        // send email with subs detail
    
        //allow user to access the services
        alert(' thhank you for your '+type+' subscriptuon. yocan acccess services now');
      }
}