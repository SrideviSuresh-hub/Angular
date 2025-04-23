import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { User } from "../Models/User";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    http: HttpClient = inject(HttpClient);
    private baseUrluser = 'https://assignment-a22f7-default-rtdb.firebaseio.com/user';


    getUsers() {
        return this.http.get<{ [key: string]: User }>(`${this.baseUrluser}.json`)
            .pipe(
                map((userdata) => {
                    if (!userdata) return [];
                    return Object.keys(userdata).map((key) => ({
                        ...userdata[key],
                        id: key
                    }))
                })
            )
    }

    addUser(user: any): Observable<any> {
        return this.http.post(`${this.baseUrluser}.json`, user);
    }
    updateUser(user: User): Observable<any> {
        const url = `${this.baseUrluser}/${user.id}.json`;
        return this.http.put(url, user);
    }
    deleteUser(userId: string): Observable<any> {
        return this.http.delete(`${this.baseUrluser}/${userId}.json`)
    }

    getUserbyUserId(userId): Observable<any> {
        return this.http.get(`${this.baseUrluser}/${userId}.json`);

    }
    getTotalOrderProductCount(userId: string): Observable<number> {
        return this.http.get<any>(`${this.baseUrluser}/${userId}/orders.json`).pipe(
            map(orderData => {
                if (!orderData) return 0;
    
                let totalProducts = 0;
    
                for (let orderKey in orderData) {
                    const order = orderData[orderKey];
                    if (order.productCount) {
                        totalProducts += order.productCount; // Sum up productCount directly
                    }
                }
    
                return totalProducts;
            }),
            catchError(() => [0]) // Handle errors gracefully
        );
    }
    
    
}
