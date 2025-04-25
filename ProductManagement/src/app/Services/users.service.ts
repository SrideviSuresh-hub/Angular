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

    // Fetches all users
    getUsers() {
        return this.http.get<{ [key: string]: User }>(`${this.baseUrluser}.json`).pipe(
            map((userdata) => {
                if (!userdata) return []; 
                return Object.keys(userdata).map((key) => {
                    const user = { 
                        ...userdata[key], 
                        id: key, 
                        productCount: userdata[key].productCount || 0 
                    };
                    if (!userdata[key].productCount) {
                        this.updateUserProductCount(user.id, 0).subscribe();
                    }
                    return user; 
                });
            })
        );
    }
    
    // Sends a new user request
    addUser(user: any): Observable<any> {
        return this.http.post(`${this.baseUrluser}.json`, user);
    }

    // Updates an existing user's details
    updateUser(user: User): Observable<any> {
        const url = `${this.baseUrluser}/${user.id}.json`;
        return this.http.put(url, user);
    }

    // Deletes a user record
    deleteUser(userId: string): Observable<any> {
        return this.http.delete(`${this.baseUrluser}/${userId}.json`)
    }

    // Retrieves user details
    getUserbyUserId(userId): Observable<any> {
        return this.http.get(`${this.baseUrluser}/${userId}.json`);
    }

    // Calculates total ordered product count
    getTotalOrderProductCount(userId: string): Observable<number> {
        return this.http.get<any>(`${this.baseUrluser}/${userId}/orders.json`).pipe(
            map(orderData => {
                if (!orderData) return 0;
                let totalProducts = 0;
                for (let orderKey in orderData) {
                    const order = orderData[orderKey];
                    if (order.productCount) {
                        totalProducts += order.productCount; 
                    }
                }
                return totalProducts;
            }),
            catchError(() => [0]) 
        );
    }
    
    // Updates a user’s total product count
    updateUserProductCount(userId: string, totalCount: number): Observable<any> {
        const userUrl = `${this.baseUrluser}/${userId}.json`;
        return this.http.patch(userUrl, { productCount: totalCount });
    }
    
    
}
