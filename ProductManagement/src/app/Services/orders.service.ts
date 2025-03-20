import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class OrdersService{
private  baseUrlOrders = 'https://assignment-a22f7-default-rtdb.firebaseio.com/orders';

http:HttpClient=inject(HttpClient);


getOrders():Observable<any>{
    const curUser=JSON.parse(localStorage.getItem('user')||'{}')
    return this.http.get<any[]>(`${this.baseUrlOrders}.json`).pipe(
        map(orderData=>{
            if(!orderData) return[];
            return Object.keys(orderData).map(key=>
                ({...orderData[key],id:key}))
                .filter(order=>order.userId===curUser.id)
        })
    )
}

deleteOrder(id:string):Observable<any>{
    return this.http.delete(`${this.baseUrlOrders}/${id}.json`);
}}