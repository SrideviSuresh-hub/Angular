import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, switchMap } from "rxjs";
import { OrderProducts } from "../Models/orderproducts";
import { Order } from "../Models/orders";

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    // private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/orders';
    private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/user';
    http: HttpClient = inject(HttpClient);
    curUser = JSON.parse(localStorage.getItem('user') || '{}')
    // products: OrderProducts[];

    // addOrders(order:Order):Observable<Order>{
    //     return this.http.post<{name:string}>(`${this.baseUrluser}/${this.curUser.id}/orders.json`,order)
    //     .pipe(map(resp=>({
    //         ...order,
    //         keyId:resp.name
    //     })
    // ))
    // }

    getOrders(): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrluser}/${this.curUser.id}/orders.json`)
        .pipe(
            map(orderData => {
                if (!orderData) return [];
                return Object.keys(orderData).map(key =>
                ({
                    ...orderData[key],
                    keyId:key
                }));
            })
        )
    }


    deleteOrder(keyId: string): Observable<any> {
        return this.http.delete(`${this.baseUrluser}/${this.curUser.id}/orders/${keyId}/.json`);
    }

    // getOrderById(orderId: number) {
    //     return this.http.get<any[]>(`${this.baseUrluser}/${orderId}/${this.curUser.id}/orders.json`)
    // }


    getOrderProducts(keyId: string) {
        return this.http.get<any[]>(`${this.baseUrluser}/${this.curUser.id}/orders/${keyId}/products.json`);
    }
    updateDeliveryStatus(keyId: string,userId:string,prodIndex:number,status:string): Observable<any> {
       const prodPath=`${this.baseUrluser}/${userId}/orders/${keyId}/products/${prodIndex}.json`;
       console.log("Updating Firebase Path:", prodPath); 
        return this.http.patch(prodPath, { deliveryStatus: status }).pipe(
        map(() => {
            console.log(`Product ${prodIndex} updated with deliveryStatus: ${status}`);
        })
    );  }
  }

    // getAllOrders(): Observable<any> {
    //     return this.http.get<any[]>(`${this.baseUrluser}/${this.curUser.id}/orders.json`).pipe(
    //         map(orderData => {
    //             if (!orderData) return [];

    //             let ordersArray = Object.keys(orderData).map(key =>
    //                 ({ ...orderData[key], idfire: key }));

    //             return ordersArray.flatMap(order =>
    //                 order.products.map(prod => ({
    //                     orderId: order.orderID,
    //                     userId: order.userId,
    //                     productName: prod.name,
    //                     productImg: prod.image,
    //                     quantity: prod.quantity,
    //                     orderDate: order.orderDate,
    //                     deliveryStatus: order.deliveryStatus,
    //                     idfire: order.idfire
    //                 }))
    //             );
    //         })
    //     )
    // }


