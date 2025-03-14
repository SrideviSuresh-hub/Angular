import { Component } from '@angular/core';

interface Product {
  name: string;
  image: string;
  quantity: number;
}
@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent {

  searchTerm: string = '';

  products: Product[] = [
    { name: 'Product 1', image: 'assets/images/shopsy.png', quantity: 0 },
    { name: 'Product 2', image: 'path/to/image2.jpg', quantity: 0 },
   
  ];
  filteredProducts: Product[] = [...this.products];

  // searchProducts() {
  //   this.filteredProducts = this.products.filter(product =>
  //     product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }

  increaseQuantity(product: Product) {
    product.quantity++;
  }

  decreaseQuantity(product: Product) {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }
}
  

