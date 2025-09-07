import { Button } from "@mui/material";
import { PageHeadingLabel } from "../../../components";
import { LocalStorageKeys } from "../../../enums/common.enums";
import { LocalStorageOrderDetails } from "../../../interface/common.interface";
import SubPageStyles from "/src/styles/SubPages.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "/src/assets/icons/home.svg?react";
import RotateCcwIcon from "/src/assets/icons/rotate_ccw.svg?react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const orderDetails: LocalStorageOrderDetails = JSON.parse(
    localStorage.getItem(LocalStorageKeys.ORDER_DETAILS) || "null"
  );
  const navigate = useNavigate();

  function handleNavigationToHome() {
    navigate("/home");
    localStorage.removeItem(LocalStorageKeys.ORDER_DETAILS);
  }

  function handleCreateNewOrder() {
    localStorage.removeItem(LocalStorageKeys.ORDER_DETAILS);
    navigate("/order/details");
  }

  return (
    <div className={`${SubPageStyles.container}`}>
      <div className="d-flex align-items-center gap-1">
        <CheckCircleIcon sx={{ fontSize: "6rem", color: "var(--green-400)" }} />
        <PageHeadingLabel
          heading="Order confirmed"
          highlightedWords={["confirmed"]}
          subHeading={`ID: ${orderDetails?.orderId}`}
        />
      </div>

      {/* Navigation Buttons */}
      <div className={SubPageStyles.stepperButtonBox}>
        <Button
          className={SubPageStyles.stepperBtn}
          onClick={handleNavigationToHome}
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
        >
          Home
        </Button>

        <Button
          className={SubPageStyles.stepperBtn}
          onClick={handleCreateNewOrder}
          variant="contained"
          size="large"
          endIcon={<RotateCcwIcon />}
        >
          Create new order
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
