import { Component, ElementRef, EventEmitter, inject, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OrderProducts } from '../../../Models/orderproducts';
import { AuthService } from '../../../Services/auth.service';
import { CartService } from '../../../Services/cart.service';
import { ProductService } from '../../../Services/products.service';
import { OrdersService } from '../../../Services/orders.service';


@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent  {

  // authService: AuthService = inject(AuthService);
  cartService: CartService = inject(CartService);
  prodService: ProductService = inject(ProductService);
  orderService:OrdersService=inject(OrdersService);
  searchText: string = '';
  products: OrderProducts[] = [];
  filteredProducts:OrderProducts[]=[];
  showPopup: boolean = false;
  imagePreview:string| ArrayBuffer|null=null;
  newProduct: OrderProducts={ id:'', name: '', description: '', image: '', quantity: 0 };;
  selectedImageFile:File|null=null;
  isDragging: boolean = false;
  isAdmin:boolean=false;
  curUser=JSON.parse(localStorage.getItem('user'));
  ngOnInit(){
      this.isAdmin=this.curUser.isAdmin;
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
      if (this.newProduct.name && this.selectedImageFile) {
          const reader = new FileReader();
          reader.onload = () => {
              this.newProduct.image = reader.result as string;
              const prodToAdd = { 
                  ...this.newProduct, 
                  quantity: 0, 
                  orderCount: 0, 
                  totalCount: 100 
              };
  
              // Add product and capture Firebase-generated ID
              this.prodService.addProduct(prodToAdd).subscribe(response => {
                const generatedId = response.name;  
                // prodToAdd.orderCount=this.getTotalOrderedCount(generatedId)
                  this.prodService.updateProduct(generatedId, { ...prodToAdd,id: generatedId }).subscribe(() => {
                      this.loadProducts();
                      this.closePopup();
                  });
              });
          };
          reader.readAsDataURL(this.selectedImageFile);
      }
  }
  

 getTotalOrderedCount(prodId: string): number {
  let totalOrdered = 0;
  this.prodService.getProductById(prodId).subscribe(product => {
    if (product) {
      totalOrdered = product.orderCount || 0;
    }
  });
  return totalOrdered;
}


   showAddPopup(){
        this.showPopup=true;
        this.newProduct = { id: '', name: '', description: '', image: '', quantity: 0 };
        this.imagePreview=null;
        this.selectedImageFile=null;
    }

  closePopup() {
    this.showPopup = false;
    this.newProduct = { id: '', name: '', description: '', image: '', quantity: 0 };
    this.imagePreview=null;
  }
   onDrop(event:DragEvent){
    event.preventDefault();
    this.isDragging=true;
    if(event.dataTransfer && event.dataTransfer.files.length>0){
      this.selectedImageFile=event.dataTransfer.files[0];
      const reader=new FileReader();
      reader.onload=e=>this.imagePreview=e.target?.result;
      reader.readAsDataURL(this.selectedImageFile);
    }

   }
   onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreview = e.target?.result;
      reader.readAsDataURL(file);
    }
  }
   
   allowDrop(event:DragEvent){
event.preventDefault();

   }
   onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
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

  


