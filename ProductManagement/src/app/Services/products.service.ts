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

  // Adds a new product
  addProduct(product: OrderProducts): Observable<any> {
    return this.http.post<{ name: string }>(`${this.baseURLProd}.json`, product)
  }

  // Fetches all products
  getProducts(): Observable<any> {
    return this.http.get<OrderProducts[]>(`${this.baseURLProd}.json`)
      .pipe(
        map(resp => {
          if (!resp) return [];
          return Object.keys(resp).map(key => ({
            ...resp[key],
            id: key
          }));
        })
      );
  }

  // Retrieves a specific product
  getProductById(productId: string): Observable<OrderProducts> {
    return this.http.get<OrderProducts>(`${this.baseURLProd}/${productId}.json`).pipe(
      map(product => ({
        ...product,
        id: productId
      }))
    );
  }
  
  // Updates an existing product
  updateProduct(productId: string, product: OrderProducts): Observable<any> {
    return this.http.put<void>(`${this.baseURLProd}/${productId}.json`, product);
  }

  // Deletes a product
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<void>(`${this.baseURLProd}/${productId}.json`)
  }

  // Generates chart data
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


