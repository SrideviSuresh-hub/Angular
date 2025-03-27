import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, switchMap, tap } from "rxjs";
import { OrderProducts } from "../Models/orderproducts";
import { Order } from "../Models/orders";

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    // private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/orders';
    private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/user';
    http: HttpClient = inject(HttpClient);
    curUser = JSON.parse(localStorage.getItem('user') || '{}');


    getOrders(): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrluser}/${this.curUser.id}/orders.json`)
        .pipe(
            map(orderData => {
                console.log("Fetched Order Data:", orderData);
                if (!orderData) return [];
                return Object.keys(orderData).map(key =>
                ({
                    ...orderData[key],
                    keyId:key
                }));
            })
        )
    }

    updateOrderStatus(orderId: string, userId: string, newStatus: string) {
        const url = `${this.baseUrluser}/${userId}/orders/${orderId}.json`;
        return this.http.patch(url, { status: newStatus });
    }
    


    deleteOrder(keyId: string): Observable<any> {
        return this.http.delete(`${this.baseUrluser}/${this.curUser.id}/orders/${keyId}.json`);
    }

    getOrderProducts(keyId: string) {
        return this.http.get<any[]>(`${this.baseUrluser}/${this.curUser.id}/orders/${keyId}/products.json`);
    }



    updateDeliveryStatus(keyId: string,userId:string,prodIndex:number,status:string): Observable<any> {
       const prodPath=`${this.baseUrluser}/${userId}/orders/${keyId}/products/${prodIndex}.json`;
       console.log("Updating Firebase Path:", prodPath); 
        return this.http.patch(prodPath, { deliveryStatus: status }).pipe(
        tap(() => {
            
            console.log(`Product ${prodIndex} updated with deliveryStatus: ${status}`);
        })
    );
  }

  }


   // getOrdersByUserId(userId: string): Observable<any> {
    //     const url = `${this.baseUrluser}/${userId}/orders.json`;
    //     return this.http.get<any>(url).pipe(
    //         map(orderData => {
    //             if (!orderData) return null;
    //             return Object.keys(orderData).reduce((acc, key) => {
    //                 acc[key] = { ...orderData[key], keyId: key };
    //                 return acc;
    //             }, {});
    //         })
    //     );
    // }
    