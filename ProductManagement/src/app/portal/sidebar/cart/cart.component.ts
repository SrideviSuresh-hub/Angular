import { Component, inject } from '@angular/core';
import { CartService } from '../../../Services/cart.service';
import { OrderProducts } from '../../../Models/orderproducts';
import { Router } from '@angular/router';
import { ProductService } from '../../../Services/products.service';
import { MessageService } from 'primeng/api';
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
  isLoading: boolean = false;
  productService: ProductService = inject(ProductService)
  messageService: MessageService = inject(MessageService);
  ngOnInit() {
    this.loadCart();
    localStorage.setItem('curPath', 'portal/cart')
  }
  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.isLoading = false;
    }
    )
  }
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
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
      setTimeout(() => this.loadCart(), 100);
    });
  }

  decrementQuantity(product: OrderProducts) {
    if (product.quantity > 0) {
      product.quantity--;
      this.cartService.removeFromCart(product);
      this.productService.updateProduct(product.id, product).subscribe(() => {
        setTimeout(() => this.loadCart(), 100);
      });
    } else {
      this.removeItem(product);
    }
  }

  removeItem(product: OrderProducts) {
    product.quantity = 0;
    this.cartService.removeFromCart(product);
    this.productService.updateProduct(product.id, product).subscribe(() => {
      setTimeout(() => this.loadCart(), 200);
    })
  }



  checkOut() {
    if (this.cartItems.length === 0) {
      this.showToast('warn', 'Cart Empty', 'Your cart is empty');
      return;

    }
    else {
      this.cartItems.forEach(product => {
        product.quantity = 0;
        this.productService.updateProduct(product.id, product).subscribe();
      })
      this.cartService.checkOut().subscribe(() => {
        this.loadCart();
        this.showToast('success', 'Order Placed', 'Your order has been placed successfully!');
        this.router.navigate(['/portal/orders']);
      });
    }
  }

  removeFromCart(product) {
    this.cartItems = this.cartItems.filter(item => item.id !== product.id);
    product.quantity = 0;
    this.productService.updateProduct(product.id, product).subscribe();
    this.cartService.updateCart(this.cartItems).subscribe(() => {
    })
  }
}








// getFilteredCartItems() {
//   if (!this.searchText.trim()) {
//     return this.cartItems;
//   }
//   return this.cartItems.filter((item) =>
//     item.name.toLowerCase().includes(this.searchText.toLowerCase())
//   );
// }
