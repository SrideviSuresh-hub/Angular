export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _expiresIn: Date
    ) { }
    // get token() {
    //     if(!this._expiresIn|| this._expiresIn<new Date()){
    //     return this._token;
    //     }
    // }

}


// constructor(
//     public  firstName: string,
//     public lastName: string,
//     public  dob: string,
//     public  emailAddress: string,
//     public gender: string,
//     public  country: string,
//     public  city: string,
//     public  region: string,
//     public  postal: string,
//     public  userName: string,
//     public IsAdmin: boolean,
//     public  states: string[],
//     public  password: string,
//     public  confirmpassword: string,
//   ) {

//   }