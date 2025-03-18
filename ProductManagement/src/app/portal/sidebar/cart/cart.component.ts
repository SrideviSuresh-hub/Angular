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

  // prodService: ProductService = inject(ProductService);
  cartService: CartService = inject(CartService);
  cartItems: Product[] = [];
  router: Router = inject(Router);

  ngOnIntit() {
    this.loadCart()
  }
  loadCart() {
    this.cartService.getCart().subscribe(items => {
      console.log(items)
      this.cartItems = items;
    }
    )
  }
 
  incrementQuantity(product:Product){
    product.quantity++;
    this.cartService.updateCart(this.cartItems).subscribe(()=>{
      console.log('cart updated successfully');
    })
  }

  decrementQuantity(product:Product){
    if(product.quantity>1){
      product.quantity--;
    }else{
      this.removeItem(product);
    }
    this.cartService.updateCart(this.cartItems).subscribe(()=>{
      console.log('cart Updated Successfull')
    })
  }
  removeItem(product:Product){
    this.cartService.removeFromCart(product)
    this.loadCart();
  }
clearCart(){
  this.cartService.clearCart().subscribe(()=>{
    this.cartItems=[];
    console.log('Cart cleared')
  })
}
 
  checkOut() {

  }
}



// removeFromCart(product) {
//   this.cartItems = this.cartItems.filter(item => item.id !== product.id);
//   this.cartService.updateCart(this.cartItems).subscribe(() => {
//     console.log('Product removed from cart')
//   })
// }

