import { Component, Input } from '@angular/core';
import { Product } from '../../../Models/Product';
@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent {
  @Input()
  product:Product;
}
