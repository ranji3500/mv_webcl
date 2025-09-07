import { TDocumentCategory, TOrderStatus } from "../types/common.types";

export interface InsertBillingDetailsPayloadModel {
  order_id: number;
  user_id: number;
  paid_by: number;
  grand_total: number;
  current_order_value: number;
  total_amount_paid: number;
  current_order_amount_paid: number;
  outstanding_amount_paid: number;
  closed_outstanding_order_ids: number[];
  delivery_date: string;
}

export interface UploadDocumentPayloadModel {
  order_id: number;
  files: File[];
  doc_category: TDocumentCategory;
}

export interface GetOrdersPayloadModel {
  pageNumber: number;
  pageSize: number;
  orderStatus?: string;
  searchQuery?: string;
  deliveryDate?: string;
}

export interface GetDraftPayloadModel {
  pageNumber: number;
  pageSize: number;
}

export interface UpdateOrderDetailsPayloadModel {
  orderId: number;
  orderStatus: TOrderStatus;
  reason?: number;
}
