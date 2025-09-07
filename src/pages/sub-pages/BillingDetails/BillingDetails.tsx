import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import {
  CustomButton,
  CustomerSelectionCard,
  CustomModal,
  PageHeadingLabel,
} from "../../../components";
import SubPageStyles from "/src/styles/SubPages.module.css";
import {
  LocalStorageOrderDetails,
  ValidationModel,
} from "../../../interface/common.interface";
import {
  LocalStorageKeys,
  OrderStage,
  SnackbarSeverity,
} from "../../../enums/common.enums";
import OrderSummary from "../../../components/OrderSummary";
import { useLoader } from "../../../contexts/LoaderContext";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { CustomerType } from "../../../enums/createOrder.enums";
import {
  Commodity,
  CustomerDetails,
  CustomerOutstandingBalance,
  SelectedCommodity,
} from "../../../interface/createOrder.interface";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CustomerOutstandingSelection from "../../../components/CustomerOutstandingSelection";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { InsertBillingDetailsPayloadModel } from "../../../interface/requestPayload.interface";
import { useAuth } from "../../../contexts/AuthContext";
import { format } from "date-fns";

const BillingDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const steps = ["Order Details", "Commodities", "Billing"];
  const { user } = useAuth();
  const orderDetails: LocalStorageOrderDetails = JSON.parse(
    localStorage.getItem(LocalStorageKeys.ORDER_DETAILS) || "null"
  );
  const { showLoader, hideLoader } = useLoader();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [selectedCommodities, setSelectedCommodities] = useState<
    SelectedCommodity[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);
  const [senderDetails, setSenderDetails] = useState<CustomerDetails | null>(
    null
  );
  const [receiverDetails, setReceiverDetails] =
    useState<CustomerDetails | null>(null);
  const [selectedOutstandingIds, setSelectedOutstandingIds] = useState<
    number[]
  >([]);
  const [isCustomerOutstandingModalOpen, setIsCustomerOutstandingModalOpen] =
    useState<boolean>(false);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [isGrandTotalValid, setIsGrandTotalValid] = useState<boolean>(true);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(new Date());
  const [pickerOpen, setPickerOpen] = useState(false);
  const grandTotalInputRef = useRef<HTMLInputElement>(null);

  // Calculate the total outstanding balance
  const totalOutstandingBalance = useMemo(() => {
    if (!selectedCustomer?.outstandingDetails) return 0;
    return selectedCustomer.outstandingDetails
      .filter((o) => selectedOutstandingIds.includes(o.id))
      .reduce((sum, o) => sum + o.outstandingAmount, 0);
  }, [selectedOutstandingIds, selectedCustomer?.outstandingDetails]);

  // Calculate the total order amount
  const totalOrderAmount = useMemo(() => {
    return selectedCommodities.reduce(
      (total, commodity) => total + commodity.price * commodity.qty,
      0
    );
  }, [selectedCommodities]);

  useEffect(() => {
    const initialGrandTotal = totalOrderAmount + totalOutstandingBalance;

    setGrandTotal(initialGrandTotal);
    setIsGrandTotalValid(true);
  }, [totalOutstandingBalance, totalOrderAmount]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderDetails?.orderId) {
        try {
          showLoader();
          const response = await axios.get(
            `${API_BASE_URL}/orders/order-detailsbystage`,
            {
              params: {
                order_id: orderDetails.orderId,
                stage: OrderStage.BILLING,
              },
            }
          );

          const commodities: SelectedCommodity[] =
            response.data?.commodities?.map((commodity: Commodity) => ({
              id: commodity.commodityId,
              itemName: commodity.itemName,
              qty: commodity.quantity,
              price: commodity.price,
            }));
          setSelectedCommodities(commodities);

          const senderDetails = {
            customerId: response.data?.senderId,
            customerName: response.data?.senderName,
            customerType: CustomerType.SENDER,
          };
          const receiverDetails = {
            customerId: response.data?.receiverId,
            customerName: response.data?.receiverName,
            customerType: CustomerType.RECEIVER,
          };

          setSenderDetails(senderDetails);
          setReceiverDetails(receiverDetails);
        } catch (error) {
          console.error("Error fetching order stage details:", error);
          showSnackbar(
            "Failed to fetch saved order details.",
            SnackbarSeverity.ERROR
          );
        } finally {
          hideLoader();
        }
      }
    };

    fetchOrderDetails();
  }, [orderDetails?.orderId]);

  function validateBillingDetails(): ValidationModel {
    let errorMessage = null;
    let isProceed = true;

    if (!selectedCustomer?.customerId) {
      isProceed = false;
      errorMessage = `Please select sender/receiver for determining who is going to pay to proceed`;

      return { errorMessage, isProceed };
    }

    if (!deliveryDate) {
      isProceed = false;
      errorMessage = `Please select a valid delivery date to proceed`;

      return { errorMessage, isProceed };
    }

    if (!isGrandTotalValid) {
      isProceed = false;

      if (totalOutstandingBalance && grandTotal < totalOutstandingBalance)
        errorMessage = `Amount to be paid should be greater than are equal to ${totalOutstandingBalance}`;
      if (grandTotal > totalOrderAmount + totalOutstandingBalance)
        errorMessage = `Amount to be paid should be less than or equal to ${
          totalOrderAmount + totalOutstandingBalance
        }`;

      return { errorMessage, isProceed };
    }
    return { errorMessage, isProceed };
  }

  function constructBillingDetailsPayload(): InsertBillingDetailsPayloadModel | null {
    if (
      user?.userId &&
      selectedCustomer?.customerId &&
      // selectedCustomer?.outstandingDetails && //REMOVE COMMENT
      deliveryDate
    ) {
      return {
        order_id: orderDetails.orderId,
        user_id: user?.userId,
        paid_by: selectedCustomer?.customerId,
        grand_total: grandTotal,
        current_order_value: totalOrderAmount,
        total_amount_paid: grandTotal,
        current_order_amount_paid: grandTotal - totalOutstandingBalance,
        outstanding_amount_paid: grandTotal - totalOrderAmount,
        // closed_outstanding_order_ids: selectedCustomer.outstandingDetails
        //   .filter((o) => selectedOutstandingIds.includes(o.id))
        //   .map((o) => o.orderId), //REMOVE COMMENT
        closed_outstanding_order_ids: selectedOutstandingIds,
        delivery_date: format(deliveryDate, "yyyy-MM-dd"),
      };
    }

    return null;
  }

  async function handleContinue() {
    if (
      orderDetails.orderId &&
      orderDetails?.orderStage != OrderStage.BILLING
    ) {
      navigate("/order/success");
      return;
    }

    const { isProceed, errorMessage } = validateBillingDetails();

    if (!isProceed && errorMessage) {
      showSnackbar(errorMessage, SnackbarSeverity.ERROR);
      return;
    }

    if (isProceed) {
      showLoader();
      const payload = constructBillingDetailsPayload();

      if (!payload) return;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/billing/insertbillingdetails`,
          payload
        );

        const { orderStage, orderId } = response.data;

        if (orderId && orderStage) {
          localStorage.setItem(
            LocalStorageKeys.ORDER_DETAILS,
            JSON.stringify(orderDetails)
          );

          navigate("/order/success");
        } else {
          showSnackbar(
            "Failed to place order. Please try again.",
            SnackbarSeverity.ERROR
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        hideLoader();
      }
    }
  }

  const handleCustomerSelect = async (customer: CustomerDetails) => {
    // If we already have outstandingDetails for this customer, just set it
    // if (customer.outstandingDetails) {

    setSelectedCustomer(customer);
    setSelectedOutstandingIds([]);
    return;
    // }

    try {
      showLoader();
      const response = await axios.get(
        `${API_BASE_URL}/customers/get_outstanding_balance/${customer.customerId}`
      );

      const outstandingDetails: CustomerOutstandingBalance[] =
        response?.data || [];

      // Assign outstanding details to the selected customer
      const updatedCustomer: CustomerDetails = {
        ...customer,
        outstandingDetails,
      };

      if (customer.customerType === CustomerType.SENDER) {
        setSenderDetails(updatedCustomer);
      } else if (customer.customerType === CustomerType.RECEIVER) {
        setReceiverDetails(updatedCustomer);
      }
      setSelectedCustomer(updatedCustomer);
    } catch (error) {
      console.error("Failed to fetch outstanding balance:", error);
      showSnackbar(
        "Failed to fetch the selected customer outstanding balance.",
        SnackbarSeverity.ERROR
      );
    } finally {
      hideLoader();
    }
  };

  function navigateToCommodities() {
    navigate("/order/commodities"); // Navigate to Commodities page
  }

  const openCustomerOutstandingModal = () => {
    setIsCustomerOutstandingModalOpen(true);
  };

  const closeCustomerOutstandingModal = () => {
    setIsCustomerOutstandingModalOpen(false);
    setSelectedOutstandingIds([]);
  };

  const handleClearOutstanding = () => {
    setIsCustomerOutstandingModalOpen(false);
  };

  const handleGrandTotalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const grandTotalValue = event.target.value;
    if (grandTotalValue == "") {
      setGrandTotal(0);
      setIsGrandTotalValid(true);
      return;
    }

    // parseFloat will ignore trailing non-numerics, so rely on validity:
    const parsedValue = parseFloat(grandTotalValue);
    // native validity check
    const valid = event.target.validity.valid;

    if (valid && !isNaN(parsedValue)) {
      setGrandTotal(parsedValue);
    }
    // If invalid, you can still set it (to show the red outline) or leave the previous value
    // Here, we'll set it so the input reflects what the user typed
    else {
      setGrandTotal(parsedValue);
    }

    setIsGrandTotalValid(valid);
  };

  // const remainingOutstandingAmount = grandTotal - totalOutstandingBalance;
  // const amountPaidForCurrentOrder = grandTotal - remainingOutstandingAmount;
  function handleGrandTotalKeyDown(e: React.KeyboardEvent) {
    const allowed = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
    const { key } = e;
    if (
      // digits, dot and minus are OK
      !/[0-9.]/.test(key) &&
      !allowed.includes(key)
    ) {
      e.preventDefault();
    }
  }

  return (
    <div className={`${SubPageStyles.container}`}>
      <PageHeadingLabel
        heading="Billing Details"
        highlightedWords={["Billing"]}
        subHeading={`ID: ${orderDetails.orderId}`}
      />
      {/* Stepper */}
      <Stepper activeStep={2}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <div className={`d-flex flex-column gap-2`}>
          <h6 className={`fs18 codGray950`}>Amount to be paid by (bill to)</h6>
          <div className={`d-flex flex-column gap-2`}>
            <CustomerSelectionCard
              customerDetails={senderDetails}
              selected={selectedCustomer?.customerType === CustomerType.SENDER}
              onSelect={handleCustomerSelect}
            />
            <CustomerSelectionCard
              customerDetails={receiverDetails}
              selected={
                selectedCustomer?.customerType === CustomerType.RECEIVER
              }
              onSelect={handleCustomerSelect}
            />
          </div>
        </div>
      </div>
      {selectedCustomer?.outstandingDetails?.length && (
        <div className={`d-flex flex-column gap-1`}>
          <h6 className={`fs18 codGray950`}>Outstanding balance for </h6>
          <ul className={`d-flex flex-column list-unstyled gap-0-8`}>
            <li className={`d-flex justify-content-between fs16`}>
              <span className={`codGray600`}>No. of unclosed bills</span>
              <button
                className={`blue400 fontSemiBold underline cursor-pointer border-none bg-transparent`}
                onClick={openCustomerOutstandingModal}
              >
                {selectedCustomer?.outstandingDetails?.length}
              </button>
            </li>
            <li className={`d-flex justify-content-between fs16`}>
              <span className={`codGray600`}>Amount of unclosed bills</span>
              <span className={`codGray950`}>
                AED{" "}
                {selectedCustomer?.outstandingDetails?.reduce(
                  (total, currOutstanding) =>
                    total + currOutstanding.outstandingAmount,
                  0
                )}
              </span>
            </li>
          </ul>
        </div>
      )}
      <div className={`d-flex flex-column gap-1`}>
        {<OrderSummary items={selectedCommodities} />}
        <div className={`d-flex justify-content-between fs16`}>
          <span className={`codGray950`}>Outstanding balance</span>
          <span className={`codGray950`}>
            AED {totalOutstandingBalance.toLocaleString()}
          </span>
        </div>
      </div>
      <div className={`d-flex justify-content-between fs16 gap-0-8`}>
        <div className={`d-flex flex-column`}>
          <span className={`codGray950`}>Grand total</span>
          {selectedCustomer?.customerId && (
            <span className={`codGray600`}>
              Amount to be paid by the {selectedCustomer?.customerType} -{" "}
              {selectedCustomer?.customerName}
            </span>
          )}
        </div>
        <div className={`d-flex align-items-center gap-1`}>
          <span className={`codGray950`}>AED</span>
          <TextField
            label="Price"
            inputRef={grandTotalInputRef}
            value={grandTotal}
            onChange={handleGrandTotalChange}
            onKeyDown={handleGrandTotalKeyDown}
            size="medium"
            type="number"
            style={{ width: "6rem" }}
            inputProps={{
              style: { textAlign: "center" },
              max: totalOutstandingBalance + totalOrderAmount,
              min: totalOutstandingBalance,
              step: 1,
            }}
            sx={{
              "& input[type=number]::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& input[type=number]": {
                MozAppearance: "textfield",
              },
            }}
            error={!isGrandTotalValid}
          />
        </div>
      </div>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="d-flex justify-content-between fs16">
          <span className="codGray600">
            Delivery in:{" "}
            {deliveryDate
              ? deliveryDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </span>
          <button
            className="blue400 fontSemiBold underline cursor-pointer border-none bg-transparent"
            onClick={() => setPickerOpen(true)}
          >
            Change date
          </button>
        </div>

        <MobileDatePicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          value={deliveryDate}
          onChange={(newDate) => {
            setDeliveryDate(newDate);
            setPickerOpen(false);
          }}
          enableAccessibleFieldDOMStructure={false}
          slots={{ textField: TextField }}
          minDate={new Date()}
          disablePast
          slotProps={{
            textField: {
              sx: { display: "none" },
            },
          }}
        />
      </LocalizationProvider>

      {/* Navigation Buttons */}
      <div className={SubPageStyles.stepperButtonBox}>
        <Button
          className={SubPageStyles.stepperBtn}
          onClick={navigateToCommodities}
          variant="contained"
          size="large"
          startIcon={<ChevronLeft />}
        >
          Go back
        </Button>

        <Button
          className={SubPageStyles.stepperBtn}
          onClick={handleContinue}
          variant="contained"
          size="large"
          endIcon={<ChevronRight />}
        >
          Place order
        </Button>
      </div>

      <CustomModal
        title="Clear Outstanding"
        isOpen={isCustomerOutstandingModalOpen}
        onClose={closeCustomerOutstandingModal}
      >
        <CustomModal.Body>
          <CustomerOutstandingSelection
            customerOutstandingDetails={
              selectedCustomer?.outstandingDetails ?? []
            }
            selectedIds={selectedOutstandingIds}
            onToggle={(id) =>
              setSelectedOutstandingIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              )
            }
          />
        </CustomModal.Body>
        <CustomModal.Footer>
          <Box display="flex" justifyContent="flex-end" gap={1.6}>
            <CustomButton
              variant="outlined"
              cancel
              rounded
              onClick={closeCustomerOutstandingModal}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              color="primary"
              size="medium"
              rounded
              onClick={handleClearOutstanding}
              disabled={selectedOutstandingIds.length === 0}
            >
              Clear Outstanding
            </CustomButton>
          </Box>
        </CustomModal.Footer>
      </CustomModal>
    </div>
  );
};

export default BillingDetails;
