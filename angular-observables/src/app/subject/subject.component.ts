import { Component, OnInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax'
@Component({
  selector: 'app-subject',
  standalone: false,
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.css'
})
export class SubjectComponent implements OnInit {

  ngOnInit() {
    //     let obs=new Observable((observer)=>{
    //         observer.next(Math.random());
    //     })

    // // subs1
    // obs.subscribe((data)=>{
    //   console.log(data);
    // })
    // //
    // obs.subscribe((data)=>{
    //   console.log(data);
    // })

    //  const sub=new Subject();
    //  sub.subscribe((data)=>{
    //    console.log(data)
    //   })
    //   sub.subscribe((data)=>{
    //     console.log(data)
    //   })
    //   sub.next(Math.random());



    //api fetch same
    // let sub=new Subject();

    // const data=ajax('https://randomuser.me/api/');

    // sub.subscribe((res)=>{console.log(res)})
    // sub.subscribe((res)=>{console.log(res)})
    // sub.subscribe((res)=>{console.log(res)})

    // data.subscribe(sub)



    // let besub = new Subject<number>();

    // let besub = new BehaviorSubject<number>(100);
    // // besub.next(10);
    // // besub.next(20);
    // // besub.next(30);
    // besub.subscribe((res) => { console.log(res) })
    // besub.subscribe((res) => { console.log(res) })
    // besub.next(2020);
    // besub.subscribe((res) => { console.log(res) })
    // besub.next(56);


    // let resub=new ReplaySubject();
    // resub.next(10);
    // resub.next(20);
    // resub.next(30);
    // resub.subscribe((data)=>{ console.log(data)}); 
    // resub.subscribe((data)=>{ console.log(data)});
    // resub.next(2000);
    // resub.subscribe((data)=>{ console.log(data)});
    // resub.next(3000);
    // resub.subscribe((data)=>{ console.log(data)});

    // // let assub=new AsyncSubject();
    // assub.next(100);
    // // assub.complete();
    // assub.next(200);
    // assub.next(300);
    // assub.subscribe((data)=> console.log(data));
    // // assub.complete();
    // assub.subscribe((data)=> console.log(data));

// let promise=new Promise((resolve,reject)=>{
//   console.log('promise called');
//   resolve(100);
//   resolve(200);
//   resolve(300);
// })
// promise.then((data)=>{
//   console.log(data);
// })
// let obs=new Observable((sub)=>{
//   console.log('observer called')
//   sub.next(100);
//   sub.next(200);
//   sub.next(300);
// })

// // obs.subscribe()
// obs.subscribe((data)=>{
//   console.log(data);
//   console.log(data);
//   console.log(data);
// })

    }
}
