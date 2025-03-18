import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Input() isLeftSidebarCollapsed: boolean = false;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();



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
  toggleCollapse() {
    this.isLeftSidebarCollapsed = !this.isLeftSidebarCollapsed;
    this.changeIsLeftSidebarCollapsed.emit(this.isLeftSidebarCollapsed);
  }

}
