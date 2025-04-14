import { Reminder } from "./reminder";

export interface User{
    username:string;
    fname:string;
    lname:string;
    gender:string;
    dob:string;
    email:string;
    mobile:number;
    address1:string;
    address2:string;
    country :string;
    state:string;
    zipcode:string;
    timezone:string;
    locale:string;
    image:string;
    isAdmin:boolean;
    datetime:string|number|Date;
    permissions?:string;
    status:string;
    password:string;
    reminders:Reminder[];
    id?:string|number|Date;
}