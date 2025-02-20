import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appSample]',
  standalone: false
})
export class SampleDirective {
  @HostBinding('value')
  inputText:String='HI using host binding';

  @HostListener('focus')
  onFocus(){
    console.log('event binding in directive using listener')
  }
  constructor() { 

  }


}
