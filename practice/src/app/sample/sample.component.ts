import { Component, ElementRef } from '@angular/core';

@Component({
  selector: '#app-sample',
  standalone: false,
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.css'
})
export class SampleComponent {
  

  name:string='ramuu';
  title:string='welcome to practice';
  instock:number=10;
  src:string='https://th.bing.com/th/id/R.80048c94faacac8b7ff6af18efa3d92a?rik=Ac82coHKVHLVyg&riu=http%3a%2f%2fwonderfulengineering.com%2fwp-content%2fuploads%2f2016%2f01%2fnature-wallpapers-8.jpg&ehk=GoUR7nA3jNm0gIdWFJoMVL1iu%2bJuWOU7Nu7KkgKZzeQ%3d&risl=&pid=ImgRaw&r=0';
  count:number=0;
  searchname:string='';
  arr:string[]=['a','b','c'];
    
  onNameChange(event:any){
    this.name=event.target.value;
  }

  onDecrement(){
    if(this.count>0){
    this.count--;
  }
}
  onIncrement(){
    if(this.instock>this.count){
    this.count++;
    }
  }

 
 sampleData = [
  {
    id: 1, 
    name: "John Doe",
    age: 30, 
    isActive: true, 
    address: { 
      street: "123 Main St",
      city: "New York",
      zipCode: "10001"
    },
    hobbies: ["reading", "traveling", "swimming"], 
    contact: { 
      email: "john.doe@example.com",
      phone: "123-456-7890"
    },
    in_inventory:true,
  },
  {
    id: 2, 
    name: "Jane Smith",
    age: 25, 
    isActive: false, 
    address: { 
      street: "456 Elm St",
      city: "Los Angeles",
      zipCode: "90001"
    },
    hobbies: ["painting", "cycling"], 
    contact: { 
      email: "jane.smith@example.com",
      phone: "987-654-3210"
    }, 
    in_inventory:false,

  },
  {
    id: 3, 
    name: "Alice Johnson",
    age: 28, 
    isActive: true, 
    address: { 
      street: "789 Oak St",
      city: "Chicago",
      zipCode: "60601"
    },
    hobbies: ["cooking", "hiking", "dancing"], 
    contact: { 
      email: "alice.johnson@example.com",
      phone: "555-123-4567"
    },
    in_inventory:true,
  }
];
}
