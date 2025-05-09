export interface OrderProducts{
    id?:string;
    name:string;
    description:string
    image:string;
    quantity:number;
    totalCount?:number;
    orderCount?:number;
    deliveryStatus?:string;
    deliveryDate?: string | Date;
  }