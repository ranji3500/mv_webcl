import {
  CustomerOutstandingStatus,
  CustomerType,
} from "../enums/createOrder.enums";

export interface Commodity {
  commodityId: number;
  itemName: string;
  price: number;
  description: string | null;
  itemPhoto: string;
  minOrderQty: number;
  maxOrderQty: number;
  createdAt: string;
  quantity?: number;
}

export interface SelectedCommodity {
  id: number | null;
  itemName: string | null;
  qty: number;
  price: number;
}

export interface CustomerDetails {
  customerId: number;
  customerName: string;
  customerType: CustomerType;
  outstandingDetails?: CustomerOutstandingBalance[];
}

export interface CustomerOutstandingBalance {
  id: number;
  customerId: number;
  orderId: number;
  outstandingAmount: number;
  status: CustomerOutstandingStatus;
  createdAt: string;
  isSelected?: boolean;
}
