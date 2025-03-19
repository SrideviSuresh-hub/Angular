import { Component, inject } from '@angular/core';
import { CartService } from '../../../Services/cart.service';
import { Product } from '../../../Models/products';
import { Router } from '@angular/router';
import { ProductService } from '../../../Services/products.service';
@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartService: CartService = inject(CartService);
  router: Router = inject(Router);
  cartItems: Product[] = [];
  searchText: string = '';
  productService:ProductService=inject(ProductService)
  ngOnInit() {
    this.loadCart()
  }
  loadCart() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      console.log('cart items', this.cartItems)
    }
    )
  }
  getFilteredCartItems() {
    if (!this.searchText.trim()) {
      return this.cartItems; // Return all items if no search text
    }
    return this.cartItems.filter((item) =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  incrementQuantity(product: Product) {
    product.quantity++;
    this.cartService.addToCart(product);
    this.productService.updateProduct(product.id, product).subscribe(()=>{
      console.log('prod updated')
   setTimeout(() => this.loadCart(), 200);
  });
  }

  decrementQuantity(product: Product) {
    product.quantity--;
    this.cartService.removeFromCart(product);
    this.productService.updateProduct(product.id, product).subscribe(()=>{
      console.log('prod updated');
   setTimeout(() => this.loadCart(), 200);
  });
  }

  removeItem(product: Product) {
    this.productService.updateProduct(product.id, product).subscribe();
   setTimeout(() => this.loadCart(), 200);
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => {
      this.cartItems = [];
     setTimeout(() => this.loadCart(), 200);
      console.log('Cart cleared');
    })
  }

  checkOut() {
    if (this.cartItems.length > 0) {
      alert("procedding to this.checkOut.");
      this.clearCart();
    }
    else {
      alert('your cart i sempty')
    }
  }

}



// removeFromCart(product) {
//   this.cartItems = this.cartItems.filter(item => item.id !== product.id);
//   this.cartService.updateCart(this.cartItems).subscribe(() => {
//     console.log('Product removed from cart')
//   })
// }

