import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

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
  searchText:string='';
  @Output()
  searchTextChnaged:EventEmitter<string>=new EventEmitter<string>();
  
  @ViewChild('searchInput') searchInputEl=ElementRef;
  
  products:Product[]=[
    {id:1,name:'clothes',description:'Explore the widest range of clothes via Shopify.',image:'assets/images/cothes.jpg',quantity:0},
    { id: 2, name: 'Shoes', description: 'Explore the widest range of shoes via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: 3, name: 'Utensils', description: 'Explore the widest range of utensils via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: 4, name: 'Watches', description: 'Explore the widest range of watches via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: 5, name: 'Accessories', description: 'Explore the widest range of accessories via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: 6, name: 'Hats', description: 'Explore the widest range of hats via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: 7, name: 'Electronics', description: 'Explore the widest range of electronics via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: 8, name: 'Bags', description: 'Explore the widest range of bags via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: 9, name: 'Glasses', description: 'Explore the widest range of glasses via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 }
  ]

  increaseQuantity(product: Product) {
    product.quantity++;
  }

  decreaseQuantity(product: Product) {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }

onSearchTextChanged(){
  this.searchTextChnaged.emit(this.searchText)
}
updateSearchText(){
  // this.searchText=this.searchInputEl.nativeElement.value;
  this.searchTextChnaged.emit(this.searchText)
}
}
