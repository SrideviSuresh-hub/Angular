import { Component, EventEmitter, inject, Input, input, Output, output } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Input() isLeftSidebarCollapsed: boolean = false;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();
  
  authService:AuthService=inject(AuthService);
  isAdmin=this.authService.isAdmin();


  items=[
    {
      routeLink:'home',
      icon:'fa-sharp fa-solid fa-house',
      label:'Home',
      isAdmin:this.isAdmin
    },
    {
      routeLink:'products',
      icon:'fa-solid fa-shapes',
      label:'Products',
      isAdmin:this.isAdmin
    },
    {
      routeLink:'cart',
      icon:'fa-solid fa-cart-shopping',
      label:'Cart',
      isAdmin:this.isAdmin
    },
    {
      routeLink:'orders',
      icon:'fa-solid fa-bag-shopping',
      label:'Orders',
      isAdmin:this.isAdmin
    },
    {
      routeLink:'users',
      icon:'fa-solid fa-users',
      label:'Users',
      isAdmin:this.isAdmin
    }
  ]
  toggleCollapse() {
    this.isLeftSidebarCollapsed = !this.isLeftSidebarCollapsed;
    this.changeIsLeftSidebarCollapsed.emit(this.isLeftSidebarCollapsed);
  }

}
