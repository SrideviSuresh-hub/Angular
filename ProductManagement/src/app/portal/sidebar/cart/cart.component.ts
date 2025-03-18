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

  prodService: ProductService = inject(ProductService);
  cartService: CartService = inject(CartService);
  cartItems: Product[] = [];
  router: Router = inject(Router);

  ngOnIntit() {
    this.loadCart()
  }
  loadCart() {
    this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart;
    }
    )
  }
  decreaseQuantity(product) {
    if (product.quantity > 1) {
      product.quantity--;
      this.cartService.removeFromCart(product);
      
    }
  }
  increaseQuantity(product) {
    product.quantity++;
    this.cartService.addToCart(product)

  }
  removeFromCart(product) {
    this.cartItems = this.cartItems.filter(item => item.id !== product.id);
    this.cartService.updateCart(this.cartItems).subscribe(() => {
      console.log('Product removed from cart')
    })
  }
  checkOut() {

  }
}



