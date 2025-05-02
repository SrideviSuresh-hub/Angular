import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, switchMap, tap } from "rxjs";
import { UsersService } from "./users.service";

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/user';
    http: HttpClient = inject(HttpClient);
    curUser = JSON.parse(localStorage.getItem('user') || '{}');
    userService: UsersService = inject(UsersService);

    // Fetches all orders
    getOrders(id:string|Date|number): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrluser}/${id}/orders.json`)
            .pipe(
                map(orderData => {
                    if (!orderData) return [];
                    return Object.keys(orderData).map(key =>
                    ({
                        ...orderData[key],
                        keyId: key,
                    }));
                })
            )
    }

    // Generates order chart data
    getOrdersChartData(id): Observable<any[]> {
        return this.getOrders(id).pipe(
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

    // Updates order status
    updateOrderStatus(orderId: string, userId: string, newStatus: string,deliveryDate:Date|string) {
        const currentDateTime = new Date().toISOString(); 
        const url = `${this.baseUrluser}/${userId}/orders/${orderId}.json`;
        return this.http.patch(url, { status: newStatus ,deliveryDate:currentDateTime}).pipe(
            switchMap(() => this.userService.getTotalOrderProductCount(userId)),
            switchMap((totalCount) => this.userService.updateUserProductCount(userId, totalCount)) 
        );
    }

    // Updates total product count
    updateUserProductCount(userId: string, totalCount: number): Observable<any> {
        const userUrl = `${this.baseUrluser}/${userId}.json`;
        return this.http.patch(userUrl, { productCount: totalCount });
    }

    // Deletes a specific order
    deleteOrder(keyId: string): Observable<any> {
        return this.http.delete(`${this.baseUrluser}/${this.curUser.id}/orders/${keyId}.json`);
    }

    // Retrieves product details
    getOrderProducts(keyId: string) {
        return this.http.get<any[]>(`${this.baseUrluser}/${this.curUser.id}/orders/${keyId}/products.json`);
    }

    // Updates delivery status
    updateDeliveryStatus(keyId: string, userId: string, prodIndex: number, status: string, deliveryDate: string | Date): Observable<any> {
        const prodPath = `${this.baseUrluser}/${userId}/orders/${keyId}/products/${prodIndex}.json`;
        return this.http.patch(prodPath, { 
            deliveryStatus: status,
            deliveryDate: status === "Delivered" ? deliveryDate : null 
             });
    }

    getOrderedProductbyId(keyId: string, userId: string, prodIndex: number){
        
        const prodPath = `${this.baseUrluser}/${userId}/orders/${keyId}/products/${prodIndex}.json`;
        console.log(prodPath);
        return this.http.get(prodPath);
    }
}
