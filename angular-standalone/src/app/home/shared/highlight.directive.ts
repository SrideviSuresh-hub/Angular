import { Directive, ElementRef } from "@angular/core";

@Directive({
    selector:'[appHighlight]',
    standalone:false
})

export class HighLightDirective{
    constructor(private element:ElementRef){
    element.nativeElement.style.backgroundColor='grey';
    element.nativeElement.style.border='2px solid black';
    element.nativeElement.style.borderRadius='2px solid yellow';
    element.nativeElement.style.padding='2rem';
        
}
}