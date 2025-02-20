import { Directive, ElementRef, Input, input, OnInit, Renderer2 } from "@angular/core";

 
 @Directive({
    selector:'[setBackground]',
    standalone:false,
 })
 export class SetBackground implements OnInit{
    // private element:ElementRef;
   //  @Input() backColor:string='#36454f';
   //  @Input() textColor:string='white';
    @Input('setBackground') 
    changebackColorAndtextColor:{backColor:string,textColor:string};
   //  title:string='';
    constructor( private element:ElementRef,private renderer:Renderer2){
    //    this.element=element;
    }
    ngOnInit(){
        //  this.element.nativeElement.style.backgroundColor='#36454f';
        // this.element.nativeElement.style.color='white'
        this.renderer.setStyle(this.element.nativeElement,'backgroundColor',this.changebackColorAndtextColor.backColor)
        this.renderer.setStyle(this.element.nativeElement,'color',this.changebackColorAndtextColor.textColor)
        // this.renderer.setAttribute(this.element.nativeElement,'title','usingsetAttribute');
        // this.renderer.removeClass(this.element.nativeElement,'.ekart-product-detail-gbc > span')
    }
 }