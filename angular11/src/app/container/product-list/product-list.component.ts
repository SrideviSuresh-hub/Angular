import { Component, Input } from '@angular/core';
import { Product } from '../../Models/Product';
@Component({
  selector: 'product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  selectedProduct:Product;
  products=[
    {
      "id": "1",
      "name": "Casual Sneakers",
      "description": "Comfortable and stylish casual sneakers perfect for everyday wear.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [5, 6, 7, 8, 9],
      "color": ["Red", "Green", "Blue", "Yellow", "Purple"],
      "price": 1999,
      "discountPrice":300,
      "is_in_inventory": true,
      "items_left": 10,
      "imageURL": "https://th.bing.com/th/id/OIP.qgB8IJNtcLdoZuuz1ygpLwHaHa?w=210&h=210&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "casual-sneakers"
    },
    {
      "id": "2",
      "name": "Elegant Heels",
      "description": "Chic and elegant heels that add a touch of sophistication to any outfit.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [5, 6, 7, 8, 9,10],
      "color":["Black", "White", "Red", "Blue", "Beige"] ,
      "price": 2999,
      "discountPrice":500,
      "is_in_inventory": true,
      "items_left": 5,
      "imageURL": "https://th.bing.com/th/id/OIP.vAu_g1AqKyVL1Y1jahya4wHaHa?w=194&h=194&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "elegant-heels"
    },
    {
      "id": "3",
      "name": "Running Shoes",
      "description": "High-performance running shoes designed for comfort and durability.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size":  [5, 6, 7, 8, 9],
      "color": ["Brown", "Gray", "Pink", "Green", "Navy"],
      "price": 2499,
      "is_in_inventory": true,
      "items_left": 8,
      "imageURL": "https://th.bing.com/th/id/OIP.RBr0sduFas_PMPySBwZnjAHaHa?w=199&h=199&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "running-shoes"
    },
    {
      "id": "4",
      "name": "Leather Boots",
      "description": "Stylish leather boots perfect for a chic and edgy look.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [9, 4, 5, 6, 7],
      "color": ["Gold", "Silver", "Coral", "Ivory", "Mint"],
      "price": 3499,
      "is_in_inventory": true,
      "discountPrice":700,
      "items_left": 7,
      "imageURL": "https://th.bing.com/th/id/OIP.wcEzhrhpz9GeAtzxinMAoQHaHa?w=204&h=204&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "leather-boots"
    },
    {
      "id": "5",
      "name": "Ballet Flats",
      "description": "Elegant ballet flats that combine comfort and style.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [ 4, 5, 6, 7,8,9],
      "color": ["Pink", "Brown", "Turquoise", "Lavender", "Maroon"],
      "price": 1599,
      "is_in_inventory": false,
      "items_left": 12,
      "imageURL": "https://th.bing.com/th/id/OIP.9GgGWH2VqvThgA2V_qovDgHaHa?w=195&h=195&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "ballet-flats"
    },
    {
      "id": "6",
      "name": "Wedge Sandals",
      "description": "Comfortable wedge sandals with a stylish design.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [ 4, 5, 6, 7,8,9],
      "color" : ["Red", "Orange", "Yellow", "Green",, "Violet"]
      ,
      "price": 2799,
      "discountPrice":500,
      "is_in_inventory": true,
      "items_left": 6,
      "imageURL": "https://th.bing.com/th/id/OIP.ZqbzNk6HbRz5ihETNfjX9gHaLG?w=122&h=183&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "wedge-sandals"
    },
    {
      "id": "7",
      "name": "Ankle Boots",
      "description": "Trendy ankle boots for a modern and chic look.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [4, 5, 6, 7, 8, 9],
      "color":  ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"],
      "price": 3199,
      "is_in_inventory": false,
      "items_left": 4,
      "imageURL": "https://th.bing.com/th/id/OIP.JotUqLWhqR5IwuOdo5Vh6wHaHa?w=211&h=211&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "ankle-boots"
    },
    {
      "id": "8",
      "name": "Loafers",
      "description": "Classic loafers that combine elegance and comfort.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [4, 5, 6, 7, 8,],
      "color": ["Rose", "Slate", "Mauve", "Ruby", "Cerulean"],
      "price": 1899,
      "is_in_inventory": true,
      "items_left": 9,
      "imageURL": "https://th.bing.com/th/id/OIP.g5vcVm6N6hLeDOkrf2lpmQHaKe?rs=1&pid=ImgDetMain",
      "slug": "loafers"
    },
    {
      "id": "9",
      "name": "Flip-Flops",
      "description": "Casual flip-flops perfect for a relaxed and laid-back style.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [4, 5, 6, 7, 8, 9],
      "color": ["Peach", "Bronze", "Violet", "Aqua", "Crimson"],
      "price": 499,
      "is_in_inventory": true,
      "items_left": 15,
      "imageURL": "https://th.bing.com/th/id/OIP.yEcL9dL303RJnTf0rymviAHaHa?w=190&h=190&c=7&r=0&o=5&dpr=2.5&pid=1.7",
      "slug": "flip-flops"
    },
    {
      "id": "10",
      "name": "Sports Sandals",
      "description": "Durable and comfortable sports sandals ideal for outdoor activities.",
      "brand": "Ekart",
      "gender": "Female",
      "category": "Footwear",
      "size": [4, 5, 6, 7, 8, 9],
      "color": ["Black", "White", "Red", "Blue", "Beige"],
      "price": 2299,
      "discountPrice":300,
      "is_in_inventory": false,
      "items_left": 3,
      "imageURL": "https://i5.walmartimages.com/asr/d75bba77-cb8e-4d34-8829-de8ef5dc9497_1.9342292831e44c70a5190e1d4bcb7b6a.jpeg",
      "slug": "sports-sandals"
    }
  ];

  totalProductCount=this.products.length;
  totalProductInStock=this.products.filter(p => p.is_in_inventory === true).length;
  totalProductOutStock=this.products.filter(p => p.is_in_inventory === false).length;

  @Input()
  searchText:string="";

  selectedFilterRadioButton:string='all';

  onFilterChanged(value:string){
    console.log(value)
    this.selectedFilterRadioButton=value;
  }
}
