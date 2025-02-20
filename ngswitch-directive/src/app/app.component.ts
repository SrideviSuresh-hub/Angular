import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ngswitch-directive';
  tab:string='';
  onInfo(){
    this.tab='info'
  }
  onPrivacy(){
    this.tab='privacy'
  }
  onService(){
    this.tab='service'
  }
  onUserAggrement(){
    this.tab='userAggrement'
  }
  
}
