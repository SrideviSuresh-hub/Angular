import { Component } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: false,
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})

export class ContainerComponent {
 listOfString:string[]=['aaa','bbb','ccc','dddd'];

 searchText:string='';

 setSearchText(value:string){
     this.searchText=value;
 }
}

//   // name:string='ramu';
//   addToCart=0;
//   product={
//     name:'Samsung',
//   color:'mint green',
//   price:999,
//   discount:11,
//   inStock:10,
//   pImage:'C:\Users\Sridevi\OneDrive - Itorizon\angular\angular1\src\assests\tsimage1.jpg'
//   }
//   getDiscountedPrice(){
//     return this.product.price-(this.product.price*this.product.discount/100);
//   }
//   // onNameChange(event:any){
//   //   console.log(event.target.value)
//   //   this.name=event.target.value;
//   // }

//   decrementCartValue(){
//     if(this.addToCart>0){
//     this.addToCart--;
//     }
//   }
//   incrementCartValue(){
//     if(this.addToCart<this.product.inStock)
//       this.addToCart++;
//       } 

