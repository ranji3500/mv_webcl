import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import styles from "./CustomerSelectionCard.module.css";
import { CustomerType } from "../../enums/createOrder.enums";
import { CustomerDetails } from "../../interface/createOrder.interface";
interface CustomerSelectionCardProps {
  customerDetails: CustomerDetails | null;
  selected?: boolean;
  onSelect?: (customerType: CustomerDetails) => void;
}

const CustomerSelectionCard: React.FC<CustomerSelectionCardProps> = ({
  customerDetails,
  selected = false,
  onSelect,
}) => {
  const isSender =
    customerDetails?.customerType.toLowerCase() === CustomerType.SENDER;

  const handleClick = () => {
    if (onSelect && customerDetails) onSelect(customerDetails);
  };

  return (
    <div
      className={`${styles.cardContainer} ${
        selected ? styles.selectedCard : ""
      } d-flex gap-2 align-items-center cursor-pointer`}
      onClick={handleClick}
    >
      <div className={`${isSender ? "primaryCuriousBlue600" : "accentRed500"}`}>
        {isSender ? (
          <ArrowOutwardIcon fontSize="medium" />
        ) : (
          <SouthWestIcon fontSize="medium" />
        )}
      </div>
      <p className={`fs16`}>
        {isSender ? "Sender" : "Receiver"} - {customerDetails?.customerName}
      </p>
    </div>
  );
};

export default CustomerSelectionCard;
