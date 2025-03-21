import { inject, Injectable } from "@angular/core";
import { Product } from "../Models/products";
import { map, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrlCart = 'https://assignment-a22f7-default-rtdb.firebaseio.com/cart';
  private baseUrlOrders = 'https://assignment-a22f7-default-rtdb.firebaseio.com/orders';
  private cart: Product[] = [];

  http: HttpClient = inject(HttpClient);

  constructor() {
    this.loadCart()
  }

  //fetch cart from firbase
  getCart(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrlCart}.json`).pipe(
      map(cartData => {
        if (!cartData) return [];
        return Object.keys(cartData).map(key => (
          { ...cartData[key], cartIndex: key }));
      })
    );
  }

  //load cart intially
  private loadCart() {
    this.getCart().subscribe(cartData => {
      this.cart = cartData;
      console.log("Cart Loaded:", this.cart);
    });
  }
  // updating entire cart 
  updateCart(cart: Product[]): Observable<any> {
    this.cart = cart;
    return this.http.put(`${this.baseUrlCart}.json`, cart);
  }

  //add prod to cart
  addToCart(product: Product): void {
    if (!this.cart) this.cart = [];
    const existingProduct = this.cart.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.quantity = product.quantity;
    } else {
      this.cart.push({ ...product });
    }
    this.updateCart(this.cart).subscribe(() => {
      this.getCart();
      console.log("Cart updated successfully", this.cart)
    });
  }


  //remove a prod from cart
  removeFromCart(product: Product) {
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
      console.log('cart updated Succesfully', this.cart)
    });
  }


  clearCart(): Observable<any> {
    // this.cart.forEach((item)=>{
    //   item.quantity=0;
    //   console.log("dfghjh")
    // })
  
    this.cart = [];
    return this.http.delete(`${this.baseUrlCart}.json`);
  }


  checkOut(): Observable<any> {
    const curUser=JSON.parse(localStorage.getItem('user')||'{}')
    if (!this.cart.length) {
      alert('Cart is Empty >Cannot Place Order!');
      return new Observable();
    }
    const orderData = {
      userId:curUser.id,
      orderId: new Date().getTime().toString(),
      products:this.cart,
      orderCount: this.cart.length,
      orderDate: new Date().toISOString(),
      deliveryStatus: 'Shipped',
    }
    return this.http.post(`${this.baseUrlOrders}.json`, orderData).pipe(
      map(() => {
        this.clearCart().subscribe(() => {
          console.log('Order Placed and cart Cleared');
        })
      })
    )
  }
}