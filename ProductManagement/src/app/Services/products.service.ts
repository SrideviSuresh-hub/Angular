import { inject, Injectable } from "@angular/core";
import { Product } from "../Models/products";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseURLProd = 'https://assignment-a22f7-default-rtdb.firebaseio.com/products';
  http: HttpClient = inject(HttpClient);



  // getAllProducts():Observable<any>{
  //   return this.http.get<Product[]>(`${this.baseURLProd}.json`)
  // }
  
  addProduct(product: Product): Observable<any> {
    return this.http.post<{ name: string }>(`${this.baseURLProd}.json`, product)
  }

  getProducts(): Observable<any> {
    return this.http.get<Product[]>(`${this.baseURLProd}.json`)
      .pipe(
        map(resp => {
          if (!resp) return [];
          console.log(Object.keys(resp))
          return Object.keys(resp).map(key => ({
            ...resp[key],
            id: key  
          }));
        })
      );
  }

 
  updateProduct(productId: string, product:Product): Observable<any> {
    return this.http.put<void>(`${this.baseURLProd}/${productId}.json`, product);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<void>(`${this.baseURLProd}/${productId}.json`)
  }

  

}






// addAllProducts(products: Product): Observable<any> {
//   return this.http.post<{ name: string }>(`${this.baseURLProd}.json`, products)
// }
 

  // removeFromCart(product: Product): void {
  //   const existingProduct = this.cart.find(p => p.id === product.id);
  //   if (existingProduct.quantity>1) {
  //     existingProduct.quantity--;
  //   } else {
  //     existingProduct.quantity--;
  //     this.cart.splice(this.cart[existingProduct.id])
  //   }
  //   console.log('Cart:', this.cart);
  // }
