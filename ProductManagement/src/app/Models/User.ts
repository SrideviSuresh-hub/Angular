
export interface User {
    id?: string;
    username: string;
    firstName: string;
    lastName?: string;
    gender: string;
    dob: string;
    email: string;
    mobile: string;
    address1: string;
    address2?: string;
    country: string;
    state: string;
    zipCode: string;
    timezone: string;
    locale: string;
    image?: string | ArrayBuffer | null;
    isAdmin: boolean;
    age?:number;
    password:string;
}