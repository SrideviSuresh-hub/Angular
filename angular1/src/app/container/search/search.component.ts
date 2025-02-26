import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchText:string="";


  //create an event
  @Output()
  searchTextChanged:EventEmitter<string>= new EventEmitter<string>();
  
  onSearchTextChanged(){
    this.searchTextChanged.emit(this.searchText)
  }
  
  updateSearchText(event: any){
   this.searchText = event.target.value;
  }


}
