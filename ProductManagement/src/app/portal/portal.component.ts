import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-portal',
  standalone: false,
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent {
  isLeftSidebarCollapsed=signal<boolean>(false);

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed:boolean){
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
