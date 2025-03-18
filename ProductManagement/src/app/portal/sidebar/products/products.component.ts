import { Component, ElementRef, EventEmitter, inject, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Product } from '../../../Models/products';
import { AuthService } from '../../../Services/auth.service';
import { CartService } from '../../../Services/cart.service';
import { ProductService } from '../../../Services/products.service';


@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent  {

  authService: AuthService = inject(AuthService);
  cartService: CartService = inject(CartService);
  prodService: ProductService = inject(ProductService);
  searchText: string = '';
  isAdmin: boolean = false;
  newProduct: { id: '', name: '', description: '', image: '', quantity: 0 };;
  products: Product[] = [];
  filteredProducts:Product[]=[];
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadProducts();
  }
  

  loadProducts() {
    this.prodService.getProducts().subscribe((res: Product[]) => {
      if (res) {
        console.log(res)
        this.products = res;
        this.filteredProducts=res;
      }
    }
    )
  }
 
  searchProducts() {
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    )
  
  }

  // addToCart(product: Product) {
  //   this.prodService.updateProduct(product.id,product);
  // }

  incrementQuantity(product: Product) {
    if (!product.quantity) product.quantity = 0; 
    product.quantity++;
    this.prodService.updateProduct(product.id,product).subscribe((resp)=>{
      resp.quantity=product.quantity;
      // console.log(product.id +" "+product.quantity);
    });
    this.cartService.addToCart(product);
  }


  decrementQuantity(product: Product) {
    if (product.quantity > 0) {
      product.quantity--;
      this.prodService.updateProduct(product.id,product).subscribe((resp)=>{
        resp.quantity=product.quantity;
        // console.log(product.id+" " +product.quantity);
      });
      this.cartService.removeFromCart(product);
    }

  }
  deleteProduct(id: string) {
      this.prodService.deleteProduct(id).subscribe()
  
    }
}
  
    //  else {
    //   product.quantity--;
    //   this.cartService.removeFromCart(product.id)
    //   console.log(product.quantity);
    // }
  

  // addNewProduct(newProduct:Product): void {
  //   if (this.newProduct.image && this.newProduct.description && this.newProduct.image) {
  //     const prodToAdd = { ...this.newProduct, id: crypto.randomUUID() };
  //     this.prodService.addProduct(prodToAdd).subscribe(() => {
  //       this.loadProducts();

  //       this.newProduct = { id: '', name: '', description: '', image: '', quantity: 0 };
  //     })

  //   }

  // }
  // addNewProduct(newProd:Product){
  //   this.products.push(newProd);
  //   this.prodService.addAllProducts(this.products).subscribe((res)=>{
  //     console.log("Products Added succesfully")
  //   })
  // }
  // 



// addIntialProducts(){
//   this.prodService.addAllProducts(  { id: '9', name: 'Glasses', description: 'Explore the widest range of glasses via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 }
//   ).subscribe((res)=>{
    
//     console.log("Intial products added")
//   })
//   }
  


// { id: '1', name: 'clothes', description: 'Explore the widest range of clothes via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '2', name: 'Shoes', description: 'Explore the widest range of shoes via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '3', name: 'Utensils', description: 'Explore the widest range of utensils via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '4', name: 'Watches', description: 'Explore the widest range of watches via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '5', name: 'Accessories', description: 'Explore the widest range of accessories via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '6', name: 'Hats', description: 'Explore the widest range of hats via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '7', name: 'Electronics', description: 'Explore the widest range of electronics via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '8', name: 'Bags', description: 'Explore the widest range of bags via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '9', name: 'Glasses', description: 'Explore the widest range of glasses via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 }
