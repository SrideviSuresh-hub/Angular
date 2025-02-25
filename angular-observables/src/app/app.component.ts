import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { filter, from, fromEvent, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
// implements AfterViewInit
export class AppComponent  {
  title = 'angular-observables';
  data: any[] = [];
  //72.
  @ViewChild('createButton')
  createButton: ElementRef;
 
  createBtnObs;

  array1 = [1, 2, 3, 4, 5];
  array2 = ['a', 'b', 'c', 'd'];


  // // 70.create observable
  // myObservable = new Observable((observer) => {
  //   // observer.next([1,2,3,4,5]);
  //   setTimeout(() => { observer.next(1); }, 1000);
  //   setTimeout(() => { observer.next(2); }, 2000);
  //   setTimeout(() => { observer.next(3); }, 3000);
  //   // setTimeout(() => { observer.error(new Error('something wrong')); }, 3000);
  //   setTimeout(() => { observer.next(4); }, 4000);
  //   setTimeout(() => { observer.next(5); }, 5000);
  //   setTimeout(() => { observer.complete(); }, 6000);
  // });

  //71. of
  // myObservable=of(...this.array1,...this.array2);

  // form

  myPromise = new Promise((resolve, reject) => {
    resolve([1, 2, 3, 4]);
  })

  // myObservable = from(this.myPromise);
  
  myObservable=from([1,2,3,4,5,6])
  // .pipe(map((value)=>{ return value*5}),filter((value)=>{return value%2===0}),);

  transformObs=this.myObservable.pipe(map((value)=>{ return value*5}))

  filterObs=this.myObservable.pipe(map((value)=>{ return value*5}),filter((value)=>{return value%2===0}),)// shld return boolean

  getAsyncData() {
    // observer
    // next error complete

    // this.myObservable.subscribe((val: any) => {
    //   // this.data=val;
    //   this.data.push(val);
    // },
    //   (err) => {
    //     alert(err.message);
    //   },
    //   () => {
    //     alert('data stream complete')
    //   }
    // );


    // this.myObservable.subscribe({
      // this.transformObs.subscribe({
      this.filterObs.subscribe({
      next: (val: any) => {
        this.data.push(val);
        console.log(val);

      },
      error(err) {
        alert(err.message)
      },
      complete() {
        alert('completed')
      }
    })
  }
  // //<--form event
  // onButtonClicked(){
  //   let count=0;
  //   this.createBtnObs= fromEvent(this.createButton.nativeElement,'click');
  //   this.createBtnObs.subscribe((data)=>{
  //     this.showItem(++count);
  //    console.log(data)
  //   })
                       
  //  }

  //   ngAfterViewInit(){
  //    this.onButtonClicked();
  //   }
  //   showItem(count:number){
  //    let div=document.createElement('div');
  //    div.innerText='item '+count;
  //    div.style.padding='10px';
  //    div.style.margin='10px 10px 0px 0px';
  //    div.style.backgroundColor='black';
  //    div.style.color='white';
  //    div.style.borderRadius='5px'
  //    document.querySelector('.data-list').appendChild(div);
  //   }
  //   //form event -->
}

