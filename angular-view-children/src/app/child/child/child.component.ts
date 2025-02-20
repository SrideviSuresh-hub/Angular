import { Component, ContentChild, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { TestComponent } from '../../test/test.component';

@Component({
  selector: 'app-child',
  standalone: false,
  templateUrl: './child.component.html',
  styleUrl: './child.component.css'
})
export class ChildComponent {
  @ContentChildren('para') paraEl:QueryList<ElementRef>;
  //  @ContentChild('para') paraEl:ElementRef;
  //     @ViewChild('para') paraEl:ElementRef;-undefined
  @ContentChildren(TestComponent) testEls:QueryList<TestComponent>;
  // @ContentChild(TestComponent)testEl:TestComponent;
   stylePara(){
    this.paraEl.forEach(el => {
      console.log(el);
    });
      // console.log(this.paraEl.nativeElement)
      this.testEls.forEach(els=>console.log(els));
      // console.log(this.testEl.name)
    
   }
}
 