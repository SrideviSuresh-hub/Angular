import { OrderProducts } from "./orderproducts";

export interface Order{
    orderId:string;
    userId:string;
    orderDate:string;
    deliveryStatus:string;
    products:OrderProducts[];
    keyId?:string;
    productCount:number;
    deliverydate?:string;
}