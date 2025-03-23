import { inject, Injectable } from "@angular/core";
import { OrderProducts } from "../Models/orderproducts";
import { map, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Order } from "../Models/orders";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrlCart = 'https://assignment-a22f7-default-rtdb.firebaseio.com/cart';
  private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/user';

  // private baseUrlOrders = 'https://assignment-a22f7-default-rtdb.firebaseio.com/orders';
  private cart: OrderProducts[] = [];
  http: HttpClient = inject(HttpClient);
  curUser=JSON.parse(localStorage.getItem('user')||'{}')
  
  constructor() {
    this.loadCart()
  }

  //fetch cart from firbase
  getCart(): Observable<OrderProducts[]> {
    return this.http.get<OrderProducts[]>(`${this.baseUrlCart}/${this.curUser.id}.json`).pipe(
      map(cartData => {
        if (!cartData) return [];
        return Object.keys(cartData).map(key => ({
           ...cartData[key],
             cartId: key }));
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
  updateCart(cart: OrderProducts[]): Observable<any> {
    // this.cart = cart;
    return this.http.put(`${this.baseUrlCart}/${this.curUser.id}.json`, cart);
  }

  //add prod to cart
  addToCart(product: OrderProducts): void {
    // if (!this.cart) this.cart = [];
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
      console.log('cart updated Succesfully', this.cart)
    });
  }


  clearCart(): Observable<any> {
    this.cart = [];
    return this.http.delete(`${this.baseUrlCart}/${this.curUser.id}.json`);
  }


  checkOut(): Observable<any> {
    if (!this.cart.length) {
      alert('Cart is Empty Cannot Place Order!');
      return new Observable();
    }
    const orderData:Order= {
      orderId: new Date().getTime().toString(),
      userId:this.curUser.id,
      products:this.cart.map(item=>({
        description:item.description,
        id:item.id,
        image:item.image,
        name:item.name,
        quantity:item.quantity
      })),
      productCount: this.cart.length,
      orderDate: new Date().toISOString(),
      deliveryStatus: 'Shipped',
    }
    return this.http.post(`${this.baseUrluser}/${this.curUser.id}/orders.json`,orderData).pipe(
      map(() => {
        this.clearCart().subscribe();
      })
    )
  }
}