import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";



@Directive({
    selector:"[appIf]",
    standalone:false,
})
export class IfDirective{

    constructor(private view:TemplateRef<any>, private template:ViewContainerRef){}
        @Input('appIf') set display(condition: boolean){
            if(condition){
                this.template.createEmbeddedView(this.view);
            }
            else{
                this.template.clear();
            }
        }
    }
