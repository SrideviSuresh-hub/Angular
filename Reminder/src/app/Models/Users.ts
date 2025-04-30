
export interface User{
    username:string;
    fname:string;
    lname:string;
    gender:string;
    dob:string|Date|null;
    email:string;
    mobile:number;
    address1:string;
    address2:string;
    country :string;
    state:string;
    zipcode:string;
    timezone:string;
    locale:string;
    image:string |null;
    isAdmin:boolean;
    datetime:Date|string;
    permissions?:string[];
    status:string;
    password:string;
    id?:string|number;
}