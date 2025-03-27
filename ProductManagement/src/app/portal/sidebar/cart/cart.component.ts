import { Component, inject } from '@angular/core';
import { CartService } from '../../../Services/cart.service';
import { OrderProducts } from '../../../Models/orderproducts';
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
  cartItems: OrderProducts[] = [];
  searchText: string = '';
  productService: ProductService = inject(ProductService)
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
      return this.cartItems; 
    }
    return this.cartItems.filter((item) =>
      item.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  incrementQuantity(product: OrderProducts) {
    product.quantity++;
    this.cartService.addToCart(product);
    this.productService.updateProduct(product.id, product).subscribe(() => {
      console.log('prod updated')
      setTimeout(() => this.loadCart(), 200);
    });
  }

  decrementQuantity(product: OrderProducts) {
    if (product.quantity > 0) {
      product.quantity--;
      this.cartService.removeFromCart(product);
      this.productService.updateProduct(product.id, product).subscribe(() => {
        console.log('prod updated');
        setTimeout(() => this.loadCart(), 200);
      });
    } else {
      this.removeItem(product);
    }
  }

  removeItem(product: OrderProducts) {
    this.cartService.removeFromCart(product);
    this.productService.updateProduct(product.id, product).subscribe(() => {
      console.log('Product Updated');
      setTimeout(() => this.loadCart(), 200);
    })
  }

  // clearCart() {
  //   this.cartService.clearCart().subscribe(() => {
  //     this.cartItems = [];
  //     this.loadCart();
  //     console.log('Cart cleared');
  //   })
  // }

  checkOut() {
    if (this.cartItems.length === 0) {
      alert('your cart is empty');
      return;

    }
    else {
      console.log("procedding to checkOut.");
      this.cartItems.forEach(product=>{
        product.quantity=0;
        this.productService.updateProduct(product.id,product).subscribe(()=>{
          console.log("000000000000");
        })
      })
      this.cartService.checkOut().subscribe(()=>{
        this.loadCart();
        alert('order Placed Successfully!');
        this.router.navigate(['/orders']);
      });
    }
  }

}



// removeFromCart(product) {
//   this.cartItems = this.cartItems.filter(item => item.id !== product.id);
//   this.cartService.updateCart(this.cartItems).subscribe(() => {
//     console.log('Product removed from cart')
//   })
// }

