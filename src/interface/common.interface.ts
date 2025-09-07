import {
  TDocumentCategory,
  TOrderStage,
  TOrderStatus,
} from "../types/common.types";

export interface UserDetailsModel {
  userId: number;
  userName: string;
  email: string;
  userType: string;
  profileImageRequestPath: string;
}

export interface LocalStorageOrderDetails {
  orderId: number;
  orderStage: TOrderStage;
}

export interface ValidationModel {
  isProceed: boolean;
  errorMessage: string | null;
}

export interface OrderDetailsModel {
  orderId: number;
  orderStatus: TOrderStatus;
  senderName: string;
  senderAddressLine1: string;
  senderAddressLine2: string;
  senderCity: string;
  receiverName: string;
  receiverAddressLine1: string;
  receiverAddressLine2: string;
  receiverCity: string;
  documents: DocumentModel[];
  deliveryDate: string;
  createdAt: string;
}

export interface DocumentModel {
  documentName: string;
  documentCategory: TDocumentCategory;
  documentId: number | null;
  tempId?: string;
  tempRequestPath?: string;
}
