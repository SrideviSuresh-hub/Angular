
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
    states: string;
    zipCode: string;
    timezone: string;
    locale: string;
    image: string;
    isAdmin: boolean;
}