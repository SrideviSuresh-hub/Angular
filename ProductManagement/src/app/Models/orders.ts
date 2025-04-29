import { OrderProducts } from "./orderproducts";

export interface Order {
    orderId: string;
    userId: string;
    orderDate: string | Date;
    deliveryStatus: string;
    products: OrderProducts[];
    keyId?: string;
    productCount: number;
    deliveryDate?: string | Date;
    productIndex?: number;
}