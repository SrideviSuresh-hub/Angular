import { Component, inject } from '@angular/core';
// import { ThemeService } from './Services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProductManagement';
//   themeService:ThemeService=inject(ThemeService);
//   changeTheme(theme: string) {
//     this.themeService.switchTheme(theme);
// }
}
