import { Component, EventEmitter, inject, Input, input, OnInit, Output, output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  @Input() isLeftSidebarCollapsed: boolean = false;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();
  
  authService:AuthService=inject(AuthService);
  isAdmin:boolean=false;
  items:any[]=[];
  ngOnInit()
  {
    this.isAdmin = this.authService.isAdmin();
    this.setSidebarItems();
  }

  setSidebarItems() {
    if (this.isAdmin) {
      this.items = [
        { routeLink: 'home', icon: 'fa-sharp fa-solid fa-house', label: 'Home' },
        { routeLink: 'products', icon: 'fa-solid fa-shapes', label: 'Products' },
        { routeLink: 'users', icon: 'fa-solid fa-users', label: 'Users' }
      ];
    } else {
      this.items = [
        { routeLink: 'usersHome', icon: 'fa-sharp fa-solid fa-house', label: 'Home' },
        { routeLink: 'products', icon: 'fa-solid fa-shapes', label: 'Products' },
        { routeLink: 'cart', icon: 'fa-solid fa-cart-shopping', label: 'Cart' },
        { routeLink: 'orders', icon: 'fa-solid fa-bag-shopping', label: 'Orders' }
      ];
    }
  }


  


}
