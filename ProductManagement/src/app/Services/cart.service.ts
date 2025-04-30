import { inject, Injectable } from "@angular/core";
import { OrderProducts } from "../Models/orderproducts";
import { map, Observable, switchMap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Order } from "../Models/orders";
import { ProductService } from "./products.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrlCart = 'https://assignment-a22f7-default-rtdb.firebaseio.com/cart';
  private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/user';
  private cart: OrderProducts[] = [];
  http: HttpClient = inject(HttpClient);
  curUser = JSON.parse(localStorage.getItem('user') || '{}')
  prodService: ProductService = inject(ProductService);
  
  constructor() {
    this.loadCart()
  }

  //fetch cart from firbase
  getCart(): Observable<OrderProducts[]> {
    return this.http.get<OrderProducts[]>(`${this.baseUrlCart}/${this.curUser.id}.json`).pipe(
      map(cartData => {
        if (!cartData) return [];
        return Object.keys(cartData).map(key => ({
          ...cartData[key]
        }));
      })
    );
  }


  //loads cart data
  private loadCart() {
    this.getCart().subscribe(cartData => {
      this.cart = cartData;
    });
  }

  // Updates Firebase cart data
  updateCart(cart: OrderProducts[]): Observable<any> {
    return this.http.put(`${this.baseUrlCart}/${this.curUser.id}.json`, cart);
  }

  //add prod to cart
  addToCart(product: OrderProducts): void {
    const existingProduct = this.cart.find(p => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = product.quantity;
    } else {
      this.cart.push({ ...product });
    }
    this.updateCart(this.cart).subscribe(() => {
      this.getCart();
    });
  }


  //remove a product from cart
  removeFromCart(product: OrderProducts) {
    const index = this.cart.findIndex(p => p.id === product.id);
    if (index !== -1) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
      }
      else {
        this.cart.splice(index, 1);
      }
    }
    this.updateCart(this.cart).subscribe(() => {
      this.getCart();
    });
  }

// Clears all items
  clearCart(): Observable<any> {
    this.cart = [];
    return this.http.delete(`${this.baseUrlCart}/${this.curUser.id}.json`);
  }

// places an order
  checkOut(): Observable<any> {
    if (!this.cart.length) {
      alert('Cart is Empty Cannot Place Order!');
      return new Observable();
    }
    const orderData: Order = {
      orderId: new Date().getTime().toString(),
      userId: this.curUser.id,
      products: this.cart.map(item => ({
        description: item.description,
        id: item.id,
        image: item.image,
        name: item.name,
        quantity: item.quantity
      })),
      productCount: this.cart.length,
      orderDate: new Date().toISOString(),
      deliveryStatus: 'pending',
    };
    return this.http.post(`${this.baseUrluser}/${this.curUser.id}/orders.json`, orderData).pipe(
      switchMap(() => {
        return this.incrementProductOrderCount(this.cart);
      }),
      map(() => {
        this.clearCart().subscribe();
      })
    );
  }

  // Increments product order counts
  incrementProductOrderCount(products: OrderProducts[]): Observable<any> {
    return new Observable(observer => {
      let updatedCount = 0;
      products.forEach(product => {
        this.prodService.getProductById(product.id).subscribe(existingProduct => {
          if (existingProduct) {
            existingProduct.orderCount = (existingProduct.orderCount || 0) + product.quantity;
            this.prodService.updateProduct(existingProduct.id, existingProduct).subscribe(() => {
              updatedCount++;
              if (updatedCount === products.length) {
                observer.next(true);
                observer.complete();
              }
            });
          }
        });
      });
    });
  }
}