import { Component } from '@angular/core';

interface Product{
  id:number;
  name:string;
  description:string;
  image:string;
  quantity:number;
}
@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
products:Product[]=[
  {id:1,name:'clothes',description:'Explore the widest range of clothes via Shopify.',image:'',quantity:0},
  { id: 2, name: 'Shoes', description: 'Explore the widest range of shoes via Shopify.', image: 'assets/images/', quantity: 2 },
  { id: 3, name: 'Utensils', description: 'Explore the widest range of utensils via Shopify.', image: 'assets/utensils.jpg', quantity: 2 },
  { id: 4, name: 'Watches', description: 'Explore the widest range of watches via Shopify.', image: 'assets/watches.jpg', quantity: 1 },
  { id: 5, name: 'Accessories', description: 'Explore the widest range of accessories via Shopify.', image: 'assets/accessories.jpg', quantity: 2 },
  { id: 6, name: 'Hats', description: 'Explore the widest range of hats via Shopify.', image: 'assets/hats.jpg', quantity: 3 },
  { id: 7, name: 'Electronics', description: 'Explore the widest range of electronics via Shopify.', image: 'assets/electronics.jpg', quantity: 1 },
  { id: 8, name: 'Bags', description: 'Explore the widest range of bags via Shopify.', image: 'assets/bags.jpg', quantity: 1 },
  { id: 9, name: 'Glasses', description: 'Explore the widest range of glasses via Shopify.', image: 'assets/glasses.jpg', quantity: 2 }
]
increaseQuantity(product:Product){
  product.quantity++;
}
decreaseQuantity(product:Product){
  product.quantity--;
}
}
