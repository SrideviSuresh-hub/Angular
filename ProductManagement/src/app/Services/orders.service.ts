import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, switchMap, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
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
                        keyId: key,
                    }));
                }),
                catchError(err=>{
                    console.error("Error fetching orders:", err);
                    return[];
                })
            )
    }

    getOrdersChartData(): Observable<any[]> {
        return this.getOrders().pipe(
            map(orders => {
                const weekdayMap: Record<string, number> = {
                    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
                };
    
                orders.forEach(order => {
                    const date = new Date(order.date);
                    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                    if (weekdayMap[day] !== undefined) {
                        weekdayMap[day]++;
                    }
                });
                return Object.keys(weekdayMap).map(day => ({
                    day,
                    orders: weekdayMap[day]
                }));
            })
        );
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



    updateDeliveryStatus(keyId: string, userId: string, prodIndex: number, status: string): Observable<any> {
        const prodPath = `${this.baseUrluser}/${userId}/orders/${keyId}/products/${prodIndex}.json`;
        console.log("Updating Firebase Path:", prodPath);
        return this.http.patch(prodPath, { deliveryStatus: status }).pipe(
            tap(() => {

                console.log(`Product ${prodIndex} updated with deliveryStatus: ${status}`);
            })
        );
    }

}
