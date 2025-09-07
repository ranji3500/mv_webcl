import { Button } from "@mui/material";
import { OrderDetailsModel } from "../../interface/common.interface";
import OrderPreviewListItemText from "../OrderPreviewListItemText";
import OrderStatusIndicator from "../OrderStatusIndicator";
import styles from "./OrderPreviewCardV2.module.css";
import { formatDateCustom } from "../../utils/common.utils";

const OrderPreviewCardV2 = ({
  orderDetails,
}: {
  orderDetails: OrderDetailsModel;
}) => {
  const { senderName, receiverName, deliveryDate, orderStatus } = orderDetails;

  return (
    <div
      className={`d-flex justify-content-between ${styles.orderCardContainer}`}
    >
      <div className={`d-flex flex-column gap-0-8 flex-1`}>
        <OrderPreviewListItemText
          secondaryText={`${senderName} - ${receiverName}`}
          tertiaryText={deliveryDate ? formatDateCustom(deliveryDate) : ""}
        />

        <div>
          <Button
            size="small"
            variant="outlined"
            sx={{
              color: "var(--cod-gray-900)",
              borderColor: "var(--cod-gray-800)",
            }}
          >
            View bill
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <OrderStatusIndicator status={orderStatus} />
      </div>
    </div>
  );
};

export default OrderPreviewCardV2;

// OrderStatus GET API:
// {
//   data: [
//     {
//       id:1,
//       "In Transit"
//     },
//     {
//       id:2,
//       "Picked Up"
//     },
//     {
//       id:2,
//       "Retained"
//     },
//     {
//       id:2,
//       "Delivered"
//     }
//   ]
// }

// RetainOrderStatusReason GET API:
// {
//   data: [
//     { id: 1, "reason": "Contact Issues (Wrong/Unreachable Number)" },
//     { id: 2, "reason": "Customer Not Available at Address" },
//     { id: 3, "reason": "Incorrect Delivery Address" },
//     { id: 4, "reason": "Customer Requested Reschedule" },
//     { id: 5, "reason": "Customer Refused to Accept" },
//     { id: 6, "reason": "Payment Not Ready (for COD orders)" },
//     { id: 7, "reason": "Security/Access Issues (Gated Community, No Entry)" },
//     { id: 8, "reason": "Weather Conditions Prevented Delivery" },
//     { id: 9, "reason": "Traffic or Road Blockage" },
//     { id: 10, "reason": "Vehicle Breakdown or Delivery Issue" },
//     { id: 11, "reason": "Package Damaged in Transit" },
//     { id: 12, "reason": "Customer Changed Mind" },
//     { id: 13, "reason": "COVID/Health Concerns at Delivery Location" },
//     { id: 14, "reason": "Suspicious or Unsafe Location" },
//     { id: 15, "reason": "Customer Already Received Item via Alternate Delivery" }
//   ]
// }
