import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
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

export class ProductsComponent {


  
  searchText:string='';
  isAdmin:boolean=false;
  newProduct: { id: '', name: '', description: '', image: '', quantity: 0 };
  ;
  
  products:Product[]=[
    {id:'1',name:'clothes',description:'Explore the widest range of clothes via Shopify.',image:'assets/images/cothes.jpg',quantity:0},
    { id: '2', name: 'Shoes', description: 'Explore the widest range of shoes via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: '3', name: 'Utensils', description: 'Explore the widest range of utensils via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: '4', name: 'Watches', description: 'Explore the widest range of watches via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0},
    { id: '5', name: 'Accessories', description: 'Explore the widest range of accessories via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: '6', name: 'Hats', description: 'Explore the widest range of hats via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: '7', name: 'Electronics', description: 'Explore the widest range of electronics via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: '8', name: 'Bags', description: 'Explore the widest range of bags via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
    { id: '9', name: 'Glasses', description: 'Explore the widest range of glasses via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0}
  ]
 
  authService:AuthService=inject(AuthService);
  cartService:CartService=inject(CartService);
prodService:ProductService=inject(ProductService);
  ngOnInit(){
    this.isAdmin=this.authService.isAdmin();
  }
  loadProducts();

  loadProducts(){
  this.prodService.getProducts().subscribe(
    products=>{
  this.products=products;
})
  }
  searchProducts(){
    this.products=this.products.filter((p)=>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    )
  }

 addToCart(product: Product) {
   this.cartService.updateCart(product);
  
}

incrementQuantity(product:Product){
product.quantity++;
this.cartService.updateCart(product);
}

  
  decrementQuantity(product: Product) {
    if (product.quantity > 1) {
      product.quantity--;
      this.cartService.updateCart(product)
    } else {
      product.quantity--;
      this.cartService.removeFromCart(product.id)
    }
  }

  addNewProduct():void{
    if(this.newProduct.image && this.newProduct.description && this.newProduct.image){
      const prodToAdd={...this.newProduct,id:crypto.randomUUID()};
      this.prodService.addProducts(prodToAdd).subscribe(()=>{
        this.loadProducts();

        this.newProduct = { id: '', name: '', description: '', image: '', quantity: 0};
      })
    
  }
  
}
deleteProduct(id:string){
  this.prodService.deleteProduct(id).subscribe()
  
}
  
}
