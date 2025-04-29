import { Component, ElementRef, EventEmitter, inject, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OrderProducts } from '../../../Models/orderproducts';
import { AuthService } from '../../../Services/auth.service';
import { CartService } from '../../../Services/cart.service';
import { ProductService } from '../../../Services/products.service';
import { OrdersService } from '../../../Services/orders.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent {

  searchText: string = '';
  products: OrderProducts[] = [];
  filteredProducts: OrderProducts[] = [];
  showPopup: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  newProduct: OrderProducts = { id: '', name: '', description: '', image: '', quantity: 0 };;
  selectedImageFile: File | null = null;
  isDragging: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  cartService: CartService = inject(CartService);
  prodService: ProductService = inject(ProductService);
  orderService: OrdersService = inject(OrdersService);
  msgService: MessageService = inject(MessageService);
  curUser = JSON.parse(localStorage.getItem('user'));
  
  // Loads products
  ngOnInit() {
    this.isAdmin = this.curUser.isAdmin;
    this.loadProducts();
    localStorage.setItem('curPath', '/portal/products')
  }

  // Fetches products
  loadProducts() {
    this.isLoading = true;
    this.prodService.getProducts().subscribe((res: OrderProducts[]) => {
      this.products = res;
      this.filteredProducts = [...this.products];
      this.isLoading = false;
    });
  }

  // Filters products
  searchProducts() {
    const search = this.searchText.trim().toLowerCase();
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(search));
  }

  // Updates product details
  private updateProduct(product: OrderProducts) {
    this.prodService.updateProduct(product.id, product).subscribe(() => {
    })
  }

  // Increases product quantity
  incrementQuantity(product: OrderProducts) {
    if (!product.quantity) product.quantity = 0;
    product.quantity++;
    this.updateProduct(product);
    this.cartService.addToCart(product);
  }

  // Decreases prod quantity,
  decrementQuantity(product: OrderProducts) {
    if (product.quantity > 0) {
      product.quantity--;
      this.updateProduct(product);
      this.cartService.removeFromCart(product);
    }
  }
  
  // Deletes a product
  deleteProduct(id: string) {
    this.prodService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter((p) => p.id !== id);
      this.filteredProducts = this.filteredProducts.filter((p) => p.id !== id);
    })
  }

  // Adds new product
  addNewProduct(): void {
    const alphanumericPattern = /^[a-zA-Z0-9]+$/;
      if (!this.selectedImageFile) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'image is required!' });
        return;
      }
      if (!this.newProduct.name || !alphanumericPattern.test(this.newProduct.name)) {
        this.msgService.add({ severity: 'error', summary: 'Validation Error', detail: 'Product name must be alphanumeric (no spaces or special characters)!' });
        return;
      }
    // if (this.newProduct.name && this.selectedImageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.image = reader.result as string;
        const prodToAdd = {
          ...this.newProduct,
          quantity: 0,
          orderCount: 0,
          totalCount: 100
        };
        this.prodService.addProduct(prodToAdd).subscribe(response => {
          const generatedId = response.name;
          this.prodService.updateProduct(generatedId, { ...prodToAdd, id: generatedId }).subscribe(() => {
            this.closePopup();
            this.loadProducts();
          });
        });
      };
      reader.readAsDataURL(this.selectedImageFile);
    // }
      
    
  }

  // Fetches total ordered count
  getTotalOrderedCount(prodId: string): number {
    let totalOrdered = 0;
    this.prodService.getProductById(prodId).subscribe(product => {
      if (product) {
        totalOrdered = product.orderCount || 0;
      }
    });
    return totalOrdered;
  }

  // Opens product addition popup
  showAddPopup() {
    this.showPopup = true;
    this.newProduct = { id: '', name: '', description: '', image: '', quantity: 0 };
    this.imagePreview = null;
    this.selectedImageFile = null;
  }

  // Closes product addition popup
  closePopup() {
    this.showPopup = false;
    this.newProduct = { id: '', name: '', description: '', image: '', quantity: 0 };
    this.imagePreview = null;
  }

  // Handles drag-and-drop image upload.
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedImageFile = event.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = e.target?.result;
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  // process image selection
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreview = e.target?.result;
      reader.readAsDataURL(file);
    }
  }

  // Clears selected image f
  removeImage() {
    this.imagePreview = null;
    this.selectedImageFile = null;
  }
  // Enables drag-and-drop functionality
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  // Triggers drag-over 
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  // Removes drag-over 
  onDragLeave() {
    this.isDragging = false;
  }
}


