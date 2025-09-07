import { List, ListItem, Checkbox } from "@mui/material";
import OrderPreviewListItemText from "../OrderPreviewListItemText";
import { CustomerOutstandingBalance } from "../../interface/createOrder.interface";
import { formatDateCustom } from "../../utils/common.utils";

interface Props {
  customerOutstandingDetails: CustomerOutstandingBalance[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

const CustomerOutstandingSelection: React.FC<Props> = ({
  customerOutstandingDetails,
  selectedIds,
  onToggle,
}) => (
  <List>
    {customerOutstandingDetails.map((o) => (
      <ListItem
        key={o.id}
        divider
        sx={{ display: "flex", alignItems: "flex-start" }}
        secondaryAction={
          <Checkbox
            size="large"
            edge="end"
            checked={selectedIds.includes(o.id)}
            onChange={() => onToggle(o.id)}
          />
        }
      >
        <OrderPreviewListItemText
          secondaryText={o.orderId.toString()}
          tertiaryText={formatDateCustom(o.createdAt)}
        />
      </ListItem>
    ))}
  </List>
);

export default CustomerOutstandingSelection;
