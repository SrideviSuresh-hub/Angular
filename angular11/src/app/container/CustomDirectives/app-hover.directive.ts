import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHover]',
  standalone: false
})
export class AppHoverDirective {

  constructor(private element: ElementRef, private renderer: Renderer2) { }

  @HostBinding('style.backgroundColor')
  backgroundColor: string = 'black';

  @HostBinding('style.border')
  border: string ='none';

  @HostBinding('style.color')
  color: string = 'white';

  @HostListener('mouseenter')
  onMOuseEnter() {
    this.backgroundColor = 'white';
    this.border = '2px solid black';
    this.color = 'black';
  }
  @HostListener('mouseout')
  onMOuseOut(){
    this.backgroundColor = 'black';
    this.border = 'none  ';
    this.color = 'white';
  }
}
