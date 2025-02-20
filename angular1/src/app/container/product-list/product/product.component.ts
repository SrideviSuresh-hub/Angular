import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input()
  product:{
    id:string,
    name:string,
    description:string,
    brand:string,
    gender:string,
    category:string,
    size:string,
    color:string[],
    price:number,
    discountPrice?:number,
    is_in_inventory:boolean,
    items_left:number,
    imageURL:string,
    slug:string
  }=undefined;
}
