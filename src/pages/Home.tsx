import AddIcon from "@mui/icons-material/Add";
import {
  CustomButton,
  CustomModal,
  OrderPreviewListItemText,
  PageHeadingLabel,
} from "../components";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardHeader,
  Box,
  IconButton,
  Pagination,
  Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import styles from "/src/styles/MainPages.module.css";
import OrderPreview from "../components/OrderPreview/OrderPreview";
import {
  LocalStorageKeys,
  OrderStage,
  OrderStatus,
  SnackbarSeverity,
} from "../enums/common.enums";
import { useEffect, useState } from "react";
import { TOrderStage } from "../types/common.types";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useLoader } from "../contexts/LoaderContext";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { formatDateCustom } from "../utils/common.utils";
import { OrderDetailsModel } from "../interface/common.interface";
import OrderStatusIndicator from "../components/OrderStatusIndicator";
import {
  GetDraftPayloadModel,
  GetOrdersPayloadModel,
} from "../interface/requestPayload.interface";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { usePagination } from "../hooks/usePagination.hook";

export interface DraftOrderDetails {
  orderId: number;
  orderStage: TOrderStage;
  updatedAt: string;
}

const Home = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const DEFAULT_PAGE_SIZE = 4;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { showLoader, hideLoader } = useLoader();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const orderDetailsDataManagement = usePagination<OrderDetailsModel>();
  const draftOrderDetailsDataManagement = usePagination<DraftOrderDetails>();
  const [selectedOrder, setSelectedorder] = useState<OrderDetailsModel | null>(
    null
  );
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState<boolean>(false);
  const verifyToken = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/verify_token`);
      if(res.message!=="Token is valid"){
        navigate('/login')
      }
    }catch{

    } }
    useEffect(() => {
 verifyToken();
         setTimeout(() => {
  navigate("/home", { replace: true });
}, 100);
    },[])
  const constructGetOrdersPayload = (
    pageNumber = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    searchQuery = ""
  ): GetOrdersPayloadModel => {
    const payload: GetOrdersPayloadModel = {
      pageNumber,
      pageSize,
      orderStatus: OrderStatus.PICKED_UP,
      deliveryDate: "",
    };

    if (searchQuery.trim()) {
      payload.searchQuery = searchQuery.trim();
    }

    return payload;
  };

  const constructDraftOrdersPayload = (
    pageNumber = 1,
    pageSize = DEFAULT_PAGE_SIZE
  ): GetDraftPayloadModel => {
    const payload: GetDraftPayloadModel = {
      pageNumber,
      pageSize,
    };

    return payload;
  };

  const getOrders = async (
    pageNumber = orderDetailsDataManagement.page,
    query = searchQuery
  ) => {
    showLoader();
    try {
      const payload = constructGetOrdersPayload(
        pageNumber,
        orderDetailsDataManagement.pageSize,
        query
      );
      const response = await axios.post(
        `${API_BASE_URL}/orders/getorderdeliverdetails`,
        payload
      );
      const pageSizeFromRes = response?.data?.pageSize || 0;
      const totalRecords = response?.data?.totalRecords || 0;
      const totalPagesFromRes = Math.ceil(totalRecords / pageSizeFromRes);
      const orders = response?.data?.orders || [];
      orderDetailsDataManagement.setResponseData(orders, totalPagesFromRes);

      if (orders.length && !selectedOrder) setSelectedorder(orders[0]);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load orders.", SnackbarSeverity.ERROR);
    } finally {
      hideLoader();
    }
  };

  const getDraftOrders = async (
    pageNumber = draftOrderDetailsDataManagement.page
  ) => {
    showLoader();
    try {
      const payload = constructDraftOrdersPayload(
        pageNumber,
        draftOrderDetailsDataManagement.pageSize
      );

      const response = await axios.post(
        `${API_BASE_URL}/orders/getdraftorderdetails`,
        payload
      );

      const pageSizeFromRes = response?.data?.pageSize || 0;
      const totalRecords = response?.data?.totalRecords || 0;
      const totalPagesFromRes = Math.ceil(totalRecords / pageSizeFromRes);

      draftOrderDetailsDataManagement.setResponseData(
        response?.data?.orders || [],
        totalPagesFromRes
      );
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load draft orders.", SnackbarSeverity.ERROR);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getOrders(orderDetailsDataManagement.page, searchQuery);
  }, [orderDetailsDataManagement.page, searchQuery]);

  useEffect(() => {
    getDraftOrders(draftOrderDetailsDataManagement.page);
  }, [draftOrderDetailsDataManagement.page]);

  const handleCreateOrder = () => {
    localStorage.removeItem(LocalStorageKeys.ORDER_DETAILS);
    if (draftOrderDetailsDataManagement.data.length > 0) {
      openDraftsModal();
      return;
    }

    setTimeout(() => {
      navigate("/order/details");
    });
  };

  const openDraftsModal = () => {
    setIsDraftsModalOpen(true);
  };

  const closeDraftsModal = () => {
    setIsDraftsModalOpen(false);
  };

  const handleDraftClick = (draft: DraftOrderDetails) => {
    const orderId = draft.orderId;
    const orderStage: TOrderStage = draft.orderStage;

    if (orderId && orderStage) {
      localStorage.setItem(
        LocalStorageKeys.ORDER_DETAILS,
        JSON.stringify({
          orderId,
          orderStage,
        })
      );
    }

    switch (draft.orderStage) {
      case OrderStage.COMMODITY:
        navigate("/order/commodities");
        break;
      case OrderStage.BILLING:
        navigate("/order/bill");
        break;
      default:
        showSnackbar("Invalid draft stage", SnackbarSeverity.ERROR);
    }

    closeDraftsModal();
  };

  return (
    <div className={styles.container}>
      <Card sx={{ mb: "1rem" }}>
        <CardContent>
          <PageHeadingLabel
            heading={`Hi ${user?.userName}!`}
            highlightedWords={["Hi"]}
            subHeading="Ongoing Order"
          ></PageHeadingLabel>
          {selectedOrder ? (
            <OrderPreview
              orderId={selectedOrder.orderId}
              orderStatus={selectedOrder.orderStatus}
              senderName={selectedOrder.senderName}
              senderAddressLine1={selectedOrder.senderAddressLine1}
              senderAddressLine2={selectedOrder.senderAddressLine2}
              senderCity={selectedOrder.senderCity}
              receiverName={selectedOrder.receiverName}
              receiverAddressLine1={selectedOrder.receiverAddressLine1}
              receiverAddressLine2={selectedOrder.receiverAddressLine2}
              receiverCity={selectedOrder.receiverCity}
              deliveryDate={selectedOrder.deliveryDate}
            />
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title="Upcoming Orders"
          action={
            <TextField
              fullWidth
              placeholder="Search order"
              variant="outlined"
              size="small"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  orderDetailsDataManagement.setPage(1);
                  getOrders(1, searchQuery);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          }
        />

        <CardContent>
          <List>
            {orderDetailsDataManagement.data.map((order) => (
              <ListItem
                key={order.orderId}
                divider
                sx={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedorder(order)}
                className={`d-flex align-items-center cursor-pointer gap-0-8 ${styles.listItemHover}`}
              >
                <div className="flex-1">
                  <OrderPreviewListItemText
                    primaryText={`ID: ${order.orderId}`}
                    secondaryText={`${order.senderName} - ${order.receiverName}`}
                    tertiaryText={formatDateCustom(order.deliveryDate)}
                  />
                </div>

                <div className="d-flex flex-column gap-0-4">
                  <OrderStatusIndicator status={order.orderStatus} />

                  {/* <p className={`${styles.orderStatus} ${styles.fontBold}`}>
                    <span className={styles.purpleDot}></span>
                    <span>Order Picked Up</span>
                  </p> */}
                  {/* <p className={styles.orderDeliveryEstimate}>
                    Estimated delivery at 04:00pm, 13 Jan
                  </p> */}
                </div>
              </ListItem>
            ))}
          </List>

          {orderDetailsDataManagement.totalPages >
            orderDetailsDataManagement.pageSize && (
            <div className="d-flex justify-content-center mt-1">
              <Pagination
                count={orderDetailsDataManagement.totalPages}
                page={orderDetailsDataManagement.page}
                onChange={(_, value) =>
                  orderDetailsDataManagement.setPage(value)
                }
                color="primary"
              />
            </div>
          )}
        </CardContent>
      </Card>
      {/* <CustomButton
        variant="contained"
        color="primary"
        rounded
        endIcon={<AddIcon />}
        sx={{
          position: "fixed",
          right: "3rem",
          bottom: "20rem",
        }}
      ></CustomButton> */}

      <Button
        variant="contained"
        sx={{
          position: "fixed",
          right: "3rem",
          bottom: "20rem",
          borderRadius: "999px",
          width: "6rem",
          height: "6rem",
          p: "0",
        }}
        onClick={handleCreateOrder}
      >
        <AddIcon fontSize="large" />
      </Button>

      <CustomModal
        title="Drafts"
        isOpen={isDraftsModalOpen}
        onClose={closeDraftsModal}
      >
        {/* <CustomModal.Body>
          {console.log(draftOrderDetailsDataManagement.data)}
          <List>
            {draftOrderDetailsDataManagement.data.map((draft) => (
              <ListItem
                key={draft.orderId}
                sx={{
                  justifyContent: "space-between",
                }}
                divider
                className={`d-flex align-items-center cursor-pointer gap-0-8 ${styles.listItemHover}`}
                onClick={() => handleDraftClick(draft)}
              >
                <div className="d-flex flex-column gap-0-4">
                  <p className="fs12 fontMedium codGray900">
                    {formatDateCustom(draft.updatedAt)}
                  </p>
                  <p className="fs16 codGray900">ID: {draft.orderId}</p>
                </div>

                <IconButton>
                  <ArrowRightIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          {draftOrderDetailsDataManagement.totalPages >
            draftOrderDetailsDataManagement.pageSize && (
            <div className="d-flex justify-content-center mt-1">
              <Pagination
                count={draftOrderDetailsDataManagement.totalPages}
                page={draftOrderDetailsDataManagement.page}
                onChange={(_, value) =>
                  draftOrderDetailsDataManagement.setPage(value)
                }
                color="primary"
              />
            </div>
          )}
        </CustomModal.Body> */}

        <CustomModal.Body>
  {Array.isArray(draftOrderDetailsDataManagement.data) &&
  draftOrderDetailsDataManagement.data.length > 0 &&
  draftOrderDetailsDataManagement.data[0]?.orderId ? (
    <List>
      {draftOrderDetailsDataManagement.data.map((draft) => (
        <ListItem
          key={draft.orderId}
          sx={{ justifyContent: "space-between" }}
          divider
          className={`d-flex align-items-center cursor-pointer gap-0-8 ${styles.listItemHover}`}
          onClick={() => handleDraftClick(draft)}
        >
          <div className="d-flex flex-column gap-0-4">
            <p className="fs12 fontMedium codGray900">
              {formatDateCustom(draft.updatedAt)}
            </p>
            <p className="fs16 codGray900">ID: {draft.orderId}</p>
          </div>

          <IconButton>
            <ArrowRightIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  ) : (
    <div className="text-center py-3">
      <p className="fs16 codGray600">No draft orders available.</p>
    </div>
  )}

  {draftOrderDetailsDataManagement.totalPages >
    draftOrderDetailsDataManagement.pageSize && (
    <div className="d-flex justify-content-center mt-1">
      <Pagination
        count={draftOrderDetailsDataManagement.totalPages}
        page={draftOrderDetailsDataManagement.page}
        onChange={(_, value) =>
          draftOrderDetailsDataManagement.setPage(value)
        }
        color="primary"
      />
    </div>
  )}
</CustomModal.Body>


        
        <CustomModal.Footer>
          <Box display="flex" justifyContent="flex-end" gap={1.6}>
            <CustomButton
              variant="outlined"
              cancel
              rounded
              onClick={closeDraftsModal}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              color="primary"
              size="medium"
              rounded
              onClick={() => navigate("/order/details")}
            >
              Create new order
            </CustomButton>
          </Box>
        </CustomModal.Footer>
      </CustomModal>
    </div>
  );
};

export default Home;
