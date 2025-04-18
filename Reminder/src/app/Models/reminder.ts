export interface Reminder{
    title:string;
    reminderdt:string|number|Date;
    detail:string;
    status:string;
    createdatetime:string|number|Date;
    id?:string|number|Date;
    userId:string|number|Date;
    dismissed?:boolean;
}