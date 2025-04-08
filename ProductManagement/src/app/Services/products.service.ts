import { inject, Injectable } from "@angular/core";
import { OrderProducts } from "../Models/orderproducts";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseURLProd = 'https://assignment-a22f7-default-rtdb.firebaseio.com/products';
  http: HttpClient = inject(HttpClient);
  
  addProduct(product: OrderProducts): Observable<any> {
    return this.http.post<{ name: string }>(`${this.baseURLProd}.json`, product)
  }
  getProducts(): Observable<any> {
    return this.http.get<OrderProducts[]>(`${this.baseURLProd}.json`)
      .pipe(
        map(resp => {
          console.log("Fetched Product Data:", resp); 
          if (!resp) return [];
          return Object.keys(resp).map(key => ({
            ...resp[key],
            id: key  
          }));
        })
      );
  }
  getProductById(productId: string): Observable<OrderProducts> {
    return this.http.get<OrderProducts>(`${this.baseURLProd}/${productId}.json`).pipe(
        map(product => ({
            ...product,
            id: productId
        }))
    );
}

  updateProduct(productId: string, product:OrderProducts): Observable<any> {
    return this.http.put<void>(`${this.baseURLProd}/${productId}.json`, product);
  }
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<void>(`${this.baseURLProd}/${productId}.json`)
  }
  getChartProductData(): Observable<any[]> {
    return this.getProducts().pipe(
        map(products => {
            return products.map(product => ({
                name: product.name,
                quantity: product.quantity || 1
            }));
        })
    );
}
}


