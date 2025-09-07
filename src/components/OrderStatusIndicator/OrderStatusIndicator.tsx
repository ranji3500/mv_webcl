import React from "react";
import { EllipseContainer } from "../index";
import {
  CheckCircleOutline,
  LocalShippingOutlined,
  QuestionMark,
  HailOutlined,
} from "@mui/icons-material";
import { OrderStatus } from "../../enums/common.enums";
import { TOrderStatus } from "../../types/common.types";

interface Props {
  status: TOrderStatus;
  className?: string;
  style?: React.CSSProperties;
}

const OrderStatusIndicator: React.FC<Props> = ({
  status,
  className = "",
  style,
}) => {
  const getIcon = (status: TOrderStatus) => {
    switch (status) {
      case OrderStatus.RETAINED:
        return (
          <EllipseContainer color="warning">
            <QuestionMark color="warning" fontSize="medium" />
          </EllipseContainer>
        );
      case OrderStatus.IN_TRANSIT:
        return (
          <EllipseContainer color="primary">
            <LocalShippingOutlined color="primary" fontSize="medium" />
          </EllipseContainer>
        );
      case OrderStatus.PICKED_UP:
        return (
          <EllipseContainer color="secondary">
            <HailOutlined color="secondary" fontSize="medium" />
          </EllipseContainer>
        );
      case OrderStatus.DELIVERED:
        return (
          <EllipseContainer color="success">
            <CheckCircleOutline color="success" fontSize="medium" />
          </EllipseContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`d-flex flex-column gap-1 align-items-end ${className}`}
      style={style}
    >
      {getIcon(status)}
      <p className="codGray950 fs16 fontRegular">{status}</p>
    </div>
  );
};

export default OrderStatusIndicator;
