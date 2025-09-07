export enum SnackbarSeverity {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}
export enum LocalStorageKeys {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  ORDER_DETAILS = "ORDER_DETAILS",
}

export enum OrderStatus {
  RETAINED = "Retained",
  IN_TRANSIT = "In Transit",
  PICKED_UP = "Picked Up",
  DELIVERED = "Delivered",
}

export enum DocumentCategory {
  COMMODITIES = "commodities",
  ORDER_INVOICE = "invoice",
}

export enum OrderStage {
  ORDER = "order",
  COMMODITY = "commodity",
  BILLING = "billing",
  DELIVERY = "delivery",
}
