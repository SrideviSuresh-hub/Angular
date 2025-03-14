import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  isLeftSidebarCollapsed=input.required<boolean>();
  changeIsLeftSidebarCollapsed=output<boolean>();
  items=[
    {
      routeLink:'home',
      icon:'fa-sharp fa-solid fa-house',
      label:'Home'
    },
    {
      routeLink:'products',
      icon:'fa-solid fa-shapes',
      label:'Products'
    },
    {
      routeLink:'cart',
      icon:'fa-solid fa-cart-shopping',
      label:'Cart'
    },
    {
      routeLink:'orders',
      icon:'fa-solid fa-bag-shopping',
      label:'Orders'
    }
  ]
  toggleCollapse(){
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
    console.log('change')
  }
}
