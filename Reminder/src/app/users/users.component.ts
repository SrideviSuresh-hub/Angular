import { Component } from '@angular/core';
import { User } from '../Models/Users';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  visible:boolean=false;
 
 users: User[] = [
    {
        username: "john_doe",
        fname: "John",
        lname: "Doe",
        gender: "Male",
        dob: "1990-01-01",
        email: "john.doe@example.com",
        mobile: 1234567890,
        address1: "123 Main St",
        address2: "Apt 4B",
        country: "USA",
        state: "California",
        zipcode: "90001",
        timezone: "PST",
        locale: "en-US",
        image: "https://example.com/images/john_doe.jpg",
        isAdmin: true,
        permissions: "read,write",
        datetime:new Date(),
        status:"Active"

    },
    {
        username: "jane_smith",
        fname: "Jane",
        lname: "Smith",
        gender: "Female",
        dob: "1985-05-15",
        email: "jane.smith@example.com",
        mobile: 9876543210,
        address1: "456 Elm St",
        address2: "Suite 101",
        country: "USA",
        state: "New York",
        zipcode: "10001",
        timezone: "EST",
        locale: "en-US",
        image: "https://example.com/images/jane_smith.jpg",
        isAdmin: false,
        datetime:new Date(),
        status:"Disabled"

    },
    {
        username: "alice_jones",
        fname: "Alice",
        lname: "Jones",
        gender: "Female",
        dob: "1992-07-20",
        email: "alice.jones@example.com",
        mobile: 1122334455,
        address1: "789 Oak St",
        address2: "",
        country: "Canada",
        state: "Ontario",
        zipcode: "M5H 2N2",
        timezone: "EST",
        locale: "en-CA",
        image: "https://example.com/images/alice_jones.jpg",
        isAdmin: false,
        permissions: "read",
        datetime:new Date(),
        status:"Active"
    }
];

getSeverity(status:String){
  switch(status){
    case "Active":
      return 'success';
      case 'Disabled':
        return 'secondary';
      default:
        return 'secondary';
  }
}
showDailog(){
this.visible=true;
}
//   products!: Product[];

//   constructor(private productService: ProductService) {}

//   ngOnInit() {
//       this.productService.getProductsMini().then((data) => {
//           this.products = data;
//       });
//   }
}
