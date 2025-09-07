import styles from "./OrderPreview.module.css";
import OrderPreviewListItemText from "../OrderPreviewListItemText";
import {
  DocumentModel,
  OrderDetailsModel,
} from "../../interface/common.interface";
import OrderStatusIndicator from "../OrderStatusIndicator";
import { formatDateCustom } from "../../utils/common.utils";
import ImageGalleryPreview from "../ImageGalleryPreview";
import { useEffect, useState } from "react";
import axios from "axios";
import { DocumentCategory } from "../../enums/common.enums";
import { useLoader } from "../../contexts/LoaderContext";

type OrderPreviewProps = Pick<
  OrderDetailsModel,
  | "orderId"
  | "orderStatus"
  | "senderName"
  | "receiverName"
  | "senderAddressLine1"
  | "senderAddressLine2"
  | "receiverAddressLine1"
  | "receiverAddressLine2"
  | "senderCity"
  | "receiverCity"
  | "deliveryDate"
>;

const OrderPreview = ({
  orderId,
  orderStatus,
  senderName,
  receiverName,
  senderAddressLine1,
  senderAddressLine2,
  senderCity,
  receiverAddressLine1,
  receiverAddressLine2,
  receiverCity,
  deliveryDate,
}: OrderPreviewProps) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [images, setImages] = useState<string[]>([]);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const getDocuments = async () => {
      showLoader();
      try {
        const response = await axios.get(
          `${API_BASE_URL}/orders/getdocumentsbyorderandcategory`,
          {
            params: {
              orderId: orderId,
              category: DocumentCategory.COMMODITIES,
            },
          }
        );
        const documents: DocumentModel[] = response.data || [];
        if (documents?.length) {
          const images = documents.map(
            (document) =>
              `${API_BASE_URL}/orders/getdocumentfile/${document.documentName}`
          );
          setImages(images);
        }
      } catch (error) {
        console.error("Error fetching documents by order and category:", error);
      } finally {
        hideLoader();
      }
    };

    getDocuments();
  }, []);

  return (
    <div className={`d-flex flex-column gap-1-4 p-1`}>
      <div className={`d-flex justify-content-between`}>
        <div className={`d-flex flex-column gap-0-4 `}>
          <p className={`fs32 fontBold curiousBlue950`}>ID: {orderId}</p>
          <p className="codGray600 fs14 fontRegular">
            {formatDateCustom(deliveryDate)}
          </p>
          <ImageGalleryPreview images={images} />
        </div>

        <div className={`d-flex flex-column gap-0-4 align-items-end flex-1`}>
          <div className={styles.status}>
            <OrderStatusIndicator status={orderStatus} />
          </div>
          {/* <p className="codGray800 fs14 fontRegular text-right">
              Estimated delivery at 04:00pm, 13 Jan
            </p> */}
        </div>
      </div>

      <div className={styles.infoBlock}>
        <div className="fs16 codGray950 mb-0-8">Pick-up:</div>
        <OrderPreviewListItemText
          secondaryText={senderName}
          tertiaryText={`${senderAddressLine1}, ${senderAddressLine2}, ${senderCity}`}
        ></OrderPreviewListItemText>
      </div>

      <div className={styles.infoBlock}>
        <div className="fs16 codGray950 mb-0-8">Drop-off:</div>
        <OrderPreviewListItemText
          secondaryText={receiverName}
          tertiaryText={`${receiverAddressLine1}, ${receiverAddressLine2}, ${receiverCity}`}
        ></OrderPreviewListItemText>
      </div>
    </div>
  );
};

export default OrderPreview;
