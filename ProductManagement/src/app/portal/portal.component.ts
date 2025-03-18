import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-portal',
  standalone: false,
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent {
  // isLeftSidebarCollapsed=signal<boolean>(false);
  // selectedSection: string = 'home';
  // changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed:boolean){
  //   this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  // }
  // selectedSection = '';

  isLeftSidebarCollapsed = false;

  changeIsLeftSidebarCollapsed(event: boolean) {
    this.isLeftSidebarCollapsed = event;
    console.log(this.isLeftSidebarCollapsed);
  }

  // toggleSidebar() {
  //   this.isLeftSidebarCollapsed = !this.isLeftSidebarCollapsed;
  //   console.log(this.isLeftSidebarCollapsed);
  // }
}
