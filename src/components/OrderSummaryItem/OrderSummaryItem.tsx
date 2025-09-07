import styles from "./OrderSummaryItem.module.css";

interface OrderSummaryItemProps {
  name: string;
  qty: number;
  price: number;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  name,
  qty,
  price,
}) => {
  return (
    <li className={styles.orderItemBox}>
      <span className={styles.orderItem}>
        {name} ({qty}x AED {price})
      </span>
      <span className={styles.orderItemPrice}>AED {qty * price}</span>
    </li>
  );
};

export default OrderSummaryItem;
