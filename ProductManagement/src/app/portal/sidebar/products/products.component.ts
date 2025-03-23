import { Component, ElementRef, EventEmitter, inject, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OrderProducts } from '../../../Models/orderproducts';
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
  products: OrderProducts[] = [];
  filteredProducts:OrderProducts[]=[];


  showPopup: boolean = false;
  imagePreview:string| ArrayBuffer|null=null;
  newProduct: OrderProducts={ id:'', name: '', description: '', image: '', quantity: 0 };;
selectedImageFile:File|null=null;
  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadProducts();
  }
  

  loadProducts() {
    this.prodService.getProducts().subscribe((res: OrderProducts[]) => {
        this.products = res;
        this.filteredProducts=[...this.products];
    });
  }
 
  searchProducts() {
    const search=this.searchText.toLowerCase();
    this.filteredProducts=this.products.filter((p)=>
    p.name.toLowerCase().includes(search));
  
  }

  // addToCart(product: Product) {
  //   this.prodService.updateProduct(product.id,product);
  // }

   private updateProduct( product :OrderProducts){
this.prodService.updateProduct(product.id,product).subscribe(()=>{
  // console.log(product.id +" "+product.quantity);
})
  }

  incrementQuantity(product: OrderProducts) {
    if (!product.quantity) product.quantity = 0; 
    product.quantity++;
    this.updateProduct(product);
    this.cartService.addToCart(product);
  }

  decrementQuantity(product: OrderProducts) {
  if(product.quantity>0){
      product.quantity--;
      this.updateProduct(product);
      this.cartService.removeFromCart(product);
  }
  }
  deleteProduct(id: string) {
      this.prodService.deleteProduct(id).subscribe(()=>{
        this.products=this.products.filter((p)=>p.id!==id);
        this.filteredProducts=this.filteredProducts.filter((p)=>p.id!==id);
        console.log('product deleted')
      })
    }   
    
  addNewProduct(): void {
    if (this.newProduct.image && this.newProduct.description && this.selectedImageFile) {
      const imageURL=URL.createObjectURL(this.selectedImageFile);
      this.newProduct.image=imageURL;
      const prodToAdd = { ...this.newProduct,quantity:0 };
      this.prodService.addProduct(prodToAdd).subscribe(() => {
        this.loadProducts();
        this.closePopup();
        this.newProduct = { id: '', name: '', description: '', image: '', quantity: 0 };
        this.imagePreview=null;
      })

    }

  }
   showAddPopup(){
        this.showPopup=true;
        this.imagePreview=null;
        this.selectedImageFile=null;
    }

  closePopup() {
    this.showPopup = false;
  }
   onImageUpload(event: any) {
  const file = event.target.files[0]; 
  if (file) {
    this.selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
}

}

// { id: '1', name: 'clothes', description: 'Explore the widest range of clothes via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '2', name: 'Shoes', description: 'Explore the widest range of shoes via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '3', name: 'Utensils', description: 'Explore the widest range of utensils via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '4', name: 'Watches', description: 'Explore the widest range of watches via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '5', name: 'Accessories', description: 'Explore the widest range of accessories via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '6', name: 'Hats', description: 'Explore the widest range of hats via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '7', name: 'Electronics', description: 'Explore the widest range of electronics via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '8', name: 'Bags', description: 'Explore the widest range of bags via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 },
// { id: '9', name: 'Glasses', description: 'Explore the widest range of glasses via Shopify.', image: 'assets/images/cothes.jpg', quantity: 0 }

  
    //  else {
    //   product.quantity--;
    //   this.cartService.removeFromCart(product.id)
    //   console.log(product.quantity);
    // }
  


  // addNewProduct(newProd:Product){
  //   this.products.push(newProd);
  //   this.prodService.addAllProducts(this.products).subscribe((res)=>{
  //     console.log("Products Added succesfully")
  //   })
  // }
  // 


  // addIntialProducts(){
  //   this.prodService.addAllProducts( { id: '9', name: 'Glasses', description: 'Explore the widest range of glasses via Shopify.', image: 'assets/images/glasses.png', quantity: 0 }
  
  
  
  //   ).subscribe((res)=>{
      
  //     console.log("Intial products added")
  //   })
  //   }

  


