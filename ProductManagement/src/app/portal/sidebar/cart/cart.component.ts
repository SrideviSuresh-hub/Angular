import { Component, inject } from '@angular/core';
import { CartService } from '../../../Services/cart.service';
import { Product } from '../../../Models/products';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  cartService = inject(CartService);
  cartItems:Product[]=[];
  totalPrice:number=0;
router:Router=inject(Router);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(items =>
      { this.cartItems = items;
        this.calculateTotal();
      })

  }
  calculateTotal():void{
    this.totalPrice=this.cartItems.reduce((sum,item)=>sum+item.quantity*100,0);
  }

  increaseQuantity(product: Product): void {
    product.quantity++;
    this.cartService.updateCart(product);
    this.calculateTotal();
  }

  decreaseQuantity(product: Product): void {
    if (product.quantity > 1) {
      product.quantity--;
      this.cartService.updateCart(product);
      this.calculateTotal();
    } else {
      this.removeFromCart(product);
    }
  }
  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product.id);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => this.cartItems = []);
  }
  checkout(): void {
    alert('Order placed successfully!');
    this.cartService.clearCart();
    this.router.navigate(['/orders']);
  }
}



