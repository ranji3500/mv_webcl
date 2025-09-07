// import { Button, Divider, Step, StepLabel, Stepper } from "@mui/material";
// import { PageHeadingLabel, PickupDetailForm } from "../../../components";
// import { FormType } from "../../../enums/createOrder.enums";
// import SubPageStyles from "/src/styles/SubPages.module.css";
// import { useEffect, useState } from "react";
// import { ChevronRight } from "@mui/icons-material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useSnackbar } from "../../../contexts/SnackbarContext";
// import {
//   LocalStorageKeys,
//   OrderStage,
//   SnackbarSeverity,
// } from "../../../enums/common.enums";
// import { useLoader } from "../../../contexts/LoaderContext";
// import { useAuth } from "../../../contexts/AuthContext";
// import { LocalStorageOrderDetails } from "../../../interface/common.interface";
// import { TOrderStage } from "../../../types/common.types";

// type StoreData = {
//   phoneNumber: string;
//   storeName: string;
//   email: string;
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   createdAt: string;
//   customerId: number;
//   outstandingPrice: string;
//   whatsappNumber: string;
// };

// const OrderDetails = () => {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const steps = ["Order Details", "Commodities", "Billing"];
//   const orderDetails: LocalStorageOrderDetails | null = JSON.parse(
//     localStorage.getItem(LocalStorageKeys.ORDER_DETAILS) || "null"
//   );
//   const [pickupDetails, setPickupDetails] = useState<Partial<StoreData>>({});
//   const [dropDetails, setDropDetails] = useState<Partial<StoreData>>({});
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showSnackbar } = useSnackbar();
//   const { showLoader, hideLoader } = useLoader();

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       if (orderDetails?.orderId) {
//         try {
//           showLoader();
//           const response = await axios.get(
//             `${API_BASE_URL}/orders/order-detailsbystage`,
//             {
//               params: {
//                 order_id: orderDetails.orderId,
//                 stage: OrderStage.ORDER,
//               },
//             }
//           );

//           const data = response.data;
//           setPickupDetails(data.sender);
//           setDropDetails(data.receiver);
//         } catch (error) {
//           console.error("Error fetching order stage details:", error);
//           showSnackbar(
//             "Failed to fetch saved order details.",
//             SnackbarSeverity.ERROR
//           );
//         } finally {
//           hideLoader();
//         }
//       }
//     };

//     fetchOrderDetails();
//   }, [orderDetails?.orderId]);

//   const handleContinue = async () => {
//     if (orderDetails?.orderId) {
//       navigate("/order/commodities");
//       return;
//     }

//     // No order created yet — so we create one
//     try {
//       showLoader();
//       const response = await axios.post(`${API_BASE_URL}/orders/create_order`, {
//         senderId: pickupDetails.customerId,
//         receiverId: dropDetails.customerId,
//         createdBy: user?.userId,
//       });

//       const orderId = response.data.orderId;
//       const orderStage: TOrderStage = response.data.orderStage;

//       if (orderId && orderStage) {
//         localStorage.setItem(
//           LocalStorageKeys.ORDER_DETAILS,
//           JSON.stringify({
//             orderId,
//             orderStage,
//           })
//         );
//         navigate("/order/commodities");
//       } else {
//         showSnackbar(
//           "Failed to create order. Please try again.",
//           SnackbarSeverity.ERROR
//         );
//       }
//     } catch (error) {
//       console.error("Failed to create order:", error);
//       showSnackbar(
//         "Something went wrong. Please try again later.",
//         SnackbarSeverity.ERROR
//       );
//     } finally {
//       hideLoader();
//     }
//   };

//   const isButtonDisabled = !pickupDetails.phoneNumber || !dropDetails.phoneNumber;

//   return (
//     <div className={`${SubPageStyles.container}`}>
//       <PageHeadingLabel heading="Order Details" highlightedWords={["Order"]} />

//       <Stepper activeStep={0}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       <PickupDetailForm
//         formType={FormType.PICKUP}
//         currentDetails={pickupDetails}
//         otherDetails={dropDetails}
//         setCurrentDetails={setPickupDetails}
//       />

//       <Divider />

//       <PickupDetailForm
//         formType={FormType.DROP}
//         currentDetails={dropDetails}
//         otherDetails={pickupDetails}
//         setCurrentDetails={setDropDetails}
//       />

//       <div className={SubPageStyles.stepperButtonBox}>
//         <Button
//           className={SubPageStyles.stepperBtn}
//           onClick={handleContinue}
//           variant="contained"
//           size="large"
//           endIcon={<ChevronRight />}
//           disabled={isButtonDisabled}
//         >
//           Choose commodities
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;



import { Button, Divider, Step, StepLabel, Stepper } from "@mui/material";
import { PageHeadingLabel, PickupDetailForm } from "../../../components";
import { FormType } from "../../../enums/createOrder.enums";
import SubPageStyles from "/src/styles/SubPages.module.css";
import { useEffect, useState } from "react";
import { ChevronRight } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import {
  LocalStorageKeys,
  OrderStage,
  SnackbarSeverity,
} from "../../../enums/common.enums";
import { useLoader } from "../../../contexts/LoaderContext";
import { useAuth } from "../../../contexts/AuthContext";
import { LocalStorageOrderDetails } from "../../../interface/common.interface";
import { TOrderStage } from "../../../types/common.types";

type StoreData = {
  phoneNumber: string;
  storeName: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  createdAt: string;
  customerId: number;
  outstandingPrice: string;
  whatsappNumber: string;
};

const OrderDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const steps = ["Order Details", "Commodities", "Billing"];
  const orderDetails: LocalStorageOrderDetails | null = JSON.parse(
    localStorage.getItem(LocalStorageKeys.ORDER_DETAILS) || "null"
  );
  const [pickupDetails, setPickupDetails] = useState<Partial<StoreData>>({});
  const [dropDetails, setDropDetails] = useState<Partial<StoreData>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { showLoader, hideLoader } = useLoader();

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
                stage: OrderStage.ORDER,
              },
            }
          );

          const data = response.data;
          setPickupDetails(data.sender);
          setDropDetails(data.receiver);
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

  const handleContinue = async () => {
    if (orderDetails?.orderId) {
      navigate("/order/commodities");
      return;
    }

    try {
      showLoader();
      console.log("pickupDetails : " , pickupDetails)
      const response = await axios.post(`${API_BASE_URL}/orders/create_order`, {
        senderId: pickupDetails.customerId,
        receiverId: dropDetails.customerId,
        createdBy: user?.userId,
      });

      const orderId = response.data.orderId;
      const orderStage: TOrderStage = response.data.orderStage;

      if (orderId && orderStage) {
        localStorage.setItem(
          LocalStorageKeys.ORDER_DETAILS,
          JSON.stringify({
            orderId,
            orderStage,
          })
        );
        navigate("/order/commodities");
      } else {
        showSnackbar(
          "Failed to create order. Please try again.",
          SnackbarSeverity.ERROR
        );
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      showSnackbar(
        "Something went wrong. Please try again later.",
        SnackbarSeverity.ERROR
      );
    } finally {
      hideLoader();
    }
  };
 
  const isButtonDisabled = ()=>{
  if(pickupDetails.phoneNumber && dropDetails.phoneNumber){
    return false
  }else{
    return true
  }

  }
    
 

  return (
    <div className={`${SubPageStyles.container}`}>
      <PageHeadingLabel heading="Order Details" highlightedWords={["Order"]} />

      <Stepper activeStep={0}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <PickupDetailForm
        formType={FormType.PICKUP}
        currentDetails={pickupDetails}
        otherDetails={dropDetails}
        setCurrentDetails={setPickupDetails}
      />

      <Divider />

      <PickupDetailForm
        formType={FormType.DROP}
        currentDetails={dropDetails}
        otherDetails={pickupDetails}
        setCurrentDetails={setDropDetails}
      />

      <div className={SubPageStyles.stepperButtonBox}>
        {/* {pickupDetails.phoneNumber}
        {dropDetails.phoneNumber} */}
<Button
  className={SubPageStyles.stepperBtn}
  onClick={handleContinue}
  variant="contained"
  size="large"
  endIcon={<ChevronRight />}
  disabled={!pickupDetails.phoneNumber || !dropDetails.phoneNumber}
>
  Choose commodities
</Button>

      </div>
    </div>
  );
};

export default OrderDetails;
