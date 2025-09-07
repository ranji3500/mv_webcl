import {
  Fab,
  TextField,
  IconButton,
  Divider,
  Autocomplete,
} from "@mui/material";
import { Add, Clear, Remove } from "@mui/icons-material";
import styles from "./CommodityCard.module.css";
import PreviewImage from "../PreviewImage";

import {
  Commodity,
  SelectedCommodity,
} from "../../interface/createOrder.interface";

interface CommodityCardProps {
  item: SelectedCommodity;
  index: number;
  commodities: Commodity[];
  updateCommodity: (
    index: number,
    field: keyof SelectedCommodity,
    value: number
  ) => void;
  removeCommodity: (index: number) => void;
}

const CommodityCard: React.FC<CommodityCardProps> = ({
  item,
  index,
  commodities,
  updateCommodity,
  removeCommodity,
}) => {
  const commodity = commodities.find((c) => c.commodityId === item.id);
  return (
    <>
      <li className={styles.cardContainer}>
        <div className={`${styles.cardDetailsWrapper}`}>
          <div className={styles.commodityImageWrapper}>
            <PreviewImage src={""} />
          </div>
          <div className={styles.commodityInputWrapper}>
            <div
              className={`${styles.flexRow} ${styles.justifyBetween} ${styles.alignCenter}`}
            >
              <Autocomplete
                options={commodities}
                getOptionLabel={(option) => option.itemName}
                value={
                  commodities.find((c) => c.commodityId === item.id) || null
                }
                onChange={(_, newValue) =>
                  updateCommodity(
                    index,
                    "id",
                    newValue ? newValue.commodityId : 0
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Commodities"
                    placeholder="Select a commodity"
                    variant="standard"
                  />
                )}
                fullWidth
              />

              <div className={`d-flex flex-column align-items-end gap-1`}>
                <IconButton onClick={() => removeCommodity(index)}>
                  <Clear fontSize="medium" />
                </IconButton>

                {item?.price ? (
                  <p className={styles.commodityPriceText}>AED {item.price}</p>
                ) : null}
              </div>
            </div>

            <p className={styles.commodityDescriptionText}>
              {commodity?.description
                ? commodity.description
                : "Please select a Commodity from the dropdown"}
            </p>
          </div>
        </div>
        <div
          className={`${styles.flexRow} ${styles.justifyBetween} ${styles.alignCenter}`}
        >
          <div className={styles.quantityControl}>
            <Fab
              size="small"
              onClick={() =>
                updateCommodity(index, "qty", Math.max(1, item.qty - 1))
              }
            >
              <Remove />
            </Fab>

            <TextField
              value={item.qty}
              size="medium"
              style={{ width: "4rem", textAlign: "center" }}
              inputProps={{ style: { textAlign: "center" } }}
            />

            <Fab
              size="small"
              color="primary"
              onClick={() => updateCommodity(index, "qty", item.qty + 1)}
            >
              <Add />
            </Fab>
          </div>

          {item?.price ? (
            <div className={`${styles.flexRow} ${styles.alignCenter}`}>
              <span className={styles.commodityPriceText}>AED </span>
              <TextField
                value={item.qty * item.price}
                size="medium"
                style={{ width: "6rem", textAlign: "center" }}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </div>
          ) : null}
        </div>
      </li>
      <Divider />
    </>
  );
};

export default CommodityCard;
