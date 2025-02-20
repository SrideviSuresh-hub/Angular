import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

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
  
  @ViewChild('searchInput') searchInputEL:ElementRef;

  onSearchTextChanged(){
    this.searchTextChanged.emit(this.searchText)
  }
  
  updateSearchText(){
  //  this.searchText = event.target.value;
  // console.log(searchInputEL.value);
  this.searchText=this.searchInputEL.nativeElement.value;
  this.searchTextChanged.emit(this.searchText)
  }


}
