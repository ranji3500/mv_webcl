import { SelectedCommodity } from "../../interface/createOrder.interface";
import OrderSummaryItem from "../OrderSummaryItem";
import styles from "./OrderSummary.module.css";

interface OrderSummaryProps {
  items: SelectedCommodity[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.qty, 0);
  };
  return (
    <div className={styles.summary}>
      <h6 className={styles.summaryLabel}>Order Summary</h6>
      <ul className={styles.orderSummaryList}>
        {items.map((item) => {
          return item && item.id && item.itemName ? (
            <OrderSummaryItem
              key={item.id}
              name={item.itemName}
              qty={item.qty}
              price={item.price}
            />
          ) : null;
        })}
      </ul>

      <hr className={styles.dottedDivider} />
      <p className={styles.orderTotal}>
        <span>Total</span>
        <span>AED {calculateTotal()}</span>
      </p>
    </div>
  );
};

export default OrderSummary;
