import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name:'percentage',
    standalone:false,
    
})
export class PercentagePipe implements PipeTransform{
 transform(value:number,total:number,decimal:number=0) {
    console.log(" %%calldd")
    return (value/total*100).toFixed(decimal)+"%";
 }
}