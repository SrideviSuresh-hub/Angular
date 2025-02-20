import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
  // encapsulation:ViewEncapsulation.ShadowDom
})
export class AppComponent {
  title = 'viewEncapsulation';
}
