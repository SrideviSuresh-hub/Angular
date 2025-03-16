import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
searchText:string='';
@Output()
searchTextChnaged:EventEmitter<string>=new EventEmitter<string>();

@ViewChild('searchInput') searchInputEl=ElementRef;

onSearchTextChanged(){
  this.searchTextChnaged.emit(this.searchText)
}
updateSearchText(){
  // this.searchText=this.searchInputEl.nativeElement.value;
  this.searchTextChnaged.emit(this.searchText)
}
}
