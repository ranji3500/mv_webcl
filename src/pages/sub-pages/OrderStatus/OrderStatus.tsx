import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import {
  OrderPreviewCardV2,
  PageHeadingLabel,
  PhotoUploaderPreviewer,
} from "../../../components";
import {
  LocalStorageKeys,
  OrderStatus,
  SnackbarSeverity,
} from "../../../enums/common.enums";
import {
  LocalStorageOrderDetails,
  OrderDetailsModel,
} from "../../../interface/common.interface";
import SubPageStyles from "/src/styles/SubPages.module.css";
import styles from "./OrderStatus.module.css";
import DoneIcon from "@mui/icons-material/Done";
import { useEffect, useState } from "react";
import { useLoader } from "../../../contexts/LoaderContext";
import OrderStatusIndicator from "../../../components/OrderStatusIndicator";
import { TOrderStatus } from "../../../types/common.types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { UpdateOrderDetailsPayloadModel } from "../../../interface/requestPayload.interface";

export interface RetainedReasons {
  reasonId: number;
  reason: string;
}

const orderStatuses = [
  {
    value: OrderStatus.IN_TRANSIT,
    label: "In Transit",
    icon: (
      <OrderStatusIndicator
        status={OrderStatus.IN_TRANSIT}
        style={{ flexDirection: "row", alignItems: "center" }}
      />
    ),
  },
  {
    value: OrderStatus.PICKED_UP,
    label: "Picked Up",
    icon: (
      <OrderStatusIndicator
        status={OrderStatus.PICKED_UP}
        style={{ flexDirection: "row", alignItems: "center" }}
      />
    ),
  },
  {
    value: OrderStatus.DELIVERED,
    label: "Delivered",
    icon: (
      <OrderStatusIndicator
        status={OrderStatus.DELIVERED}
        style={{ flexDirection: "row", alignItems: "center" }}
      />
    ),
  },
  {
    value: OrderStatus.RETAINED,
    label: "Retained",
    icon: (
      <OrderStatusIndicator
        status={OrderStatus.RETAINED}
        style={{ flexDirection: "row", alignItems: "center" }}
      />
    ),
  },
];

const UpdateOrderStatus = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const orderId: LocalStorageOrderDetails["orderId"] = JSON.parse(
    localStorage.getItem(LocalStorageKeys.ORDER_DETAILS) || "null"
  )?.orderId;

  const [orderDetails, setOrderData] = useState<OrderDetailsModel | null>(null);
  const { showLoader, hideLoader } = useLoader();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState<TOrderStatus>(
    OrderStatus.IN_TRANSIT
  );
  const [retainedReasons, setRetainedReasons] = useState<RetainedReasons[]>([]);
  const [retainedReasonId, setRetainedReason] = useState<number | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderStatus(event.target.value as TOrderStatus);
  };

  useEffect(() => {
    const fetchRetainedReasons = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/getallreasons`);
        // Map response to match our interface
        console.log(response.data)
        const transformed = response.data.map((item: any) => ({
          reasonId: item.reasonid,
          reason: item.reason,
        }));
        setRetainedReasons(transformed);
      } catch (error) {
        console.error("Failed to fetch retained reasons", error);
      }
    };

    fetchRetainedReasons();
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      showLoader();
      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/getdeliverorderdetails`,
          {
            params: { orderId },
          }
        );

        if (response.data?.orderId) {
          setOrderData(response.data);
          setOrderStatus(response.data.orderStatus);
        }
      } catch (error) {
        console.error("Error fetching order data", error);
      } finally {
        hideLoader();
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  function constructUpdateOrderDetailsPayload(): UpdateOrderDetailsPayloadModel {
    const payload: UpdateOrderDetailsPayloadModel = {
      orderId,
      orderStatus,
    };

    if (orderStatus === OrderStatus.RETAINED && retainedReasonId) {
      payload.reason = retainedReasonId;
    }

    return payload;
  }

  async function handleUpdateOrderStatus() {
    if (!orderId || !orderStatus) return;

    try {
      showLoader();
      const response = await axios.put(
        `${API_BASE_URL}/orders/updatedeliverorder`,
        constructUpdateOrderDetailsPayload()
      );
      if (response.data?.orderId) navigate("/orders");
    } catch (error) {
      console.error("Failed to update order status", error);
      showSnackbar("Failed to update order status", SnackbarSeverity.ERROR);
    } finally {
      hideLoader();
    }
  }

  const isUpdateStatusDisabled =
    orderDetails?.orderStatus === OrderStatus.DELIVERED ||
    orderDetails?.orderStatus === OrderStatus.RETAINED ||
    (orderStatus === OrderStatus.RETAINED && !retainedReasonId);

  return (
    <div className={SubPageStyles.container}>
      <PageHeadingLabel
        heading="Update Order Status"
        highlightedWords={["Update"]}
        subHeading={`ID: ${orderId?.toString()}`}
      />

      {orderDetails ? <OrderPreviewCardV2 orderDetails={orderDetails} /> : null}

      {orderDetails?.documents ? (
        <PhotoUploaderPreviewer images={orderDetails.documents} isOnlyPreview />
      ) : null}

      <div>
        <h6 className={`fs18 codGray950 ${styles.changeStatusLabel}`}>
          Change status
        </h6>
        <FormControl sx={{ paddingLeft: "1rem" }}>
          <RadioGroup
            value={orderStatus}
            onChange={handleChange}
            name="delivery-status"
          >
            {orderStatuses.map((item) => (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio />}
                label={item.icon}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>

      {orderStatus === OrderStatus.RETAINED && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="retained-reason-label">Reason for Retention</InputLabel>
          <Select
            labelId="retained-reason-label"
            value={retainedReasonId ?? ""}
            onChange={(e) => setRetainedReason(Number(e.target.value))}
            label="Reason for Retention"
          >
            <MenuItem value="">
              <em>Select a reason</em>
            </MenuItem>
            {retainedReasons.map((reason) => (
              <MenuItem key={reason.reasonId} value={reason.reasonId}>
                {reason.reason}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <div className={SubPageStyles.stepperButtonBox}>
        <Button
          className={SubPageStyles.stepperBtn}
          onClick={handleUpdateOrderStatus}
          variant="contained"
          size="large"
          endIcon={<DoneIcon />}
          disabled={isUpdateStatusDisabled}


          
        >
          Update Order Status
        </Button>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
