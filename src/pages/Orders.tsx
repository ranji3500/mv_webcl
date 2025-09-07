import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Card,
  CardHeader,
  CardContent,
  Pagination,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import styles from "/src/styles/MainPages.module.css";
import { OrderPreviewListItemText } from "../components";
import { LocalStorageKeys, OrderStatus } from "../enums/common.enums";
import axios from "axios";
import { useLoader } from "../contexts/LoaderContext";
import { OrderDetailsModel } from "../interface/common.interface";
import { useNavigate } from "react-router-dom";
import OrderStatusIndicator from "../components/OrderStatusIndicator";
import { GetOrdersPayloadModel } from "../interface/requestPayload.interface";
import { formatDateCustom } from "../utils/common.utils";

const tabs = [
  { label: "All", status: null },
  { label: "Picked Up", status: OrderStatus.PICKED_UP },
  { label: "In Transit", status: OrderStatus.IN_TRANSIT },
  { label: "Delivered", status: OrderStatus.DELIVERED },
  { label: "Retained", status: OrderStatus.RETAINED },
];

const Orders = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const DEFAULT_PAGE_SIZE = 4;
  const { showLoader, hideLoader } = useLoader();
  const [tabValue, setTabValue] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [orders, setOrders] = useState<OrderDetailsModel[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const verifyToken = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/verify_token`);
        console.log(res)
        if(res.message!=="Token is valid"){
          navigate('/login')
        }
      }catch{
  
      } }
      useEffect(() => {
   verifyToken();
      })
  const constructGetOrdersPayload = (
    tabValue: number,
    pageNumber = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    searchQuery = ""
  ): GetOrdersPayloadModel => {
    const selectedTab = tabs[tabValue];

    const payload: GetOrdersPayloadModel = {
      pageNumber,
      pageSize,
    };

    if (selectedTab?.status) {
      payload.orderStatus = selectedTab.status;
    }

    if (searchQuery.trim()) {
      payload.searchQuery = searchQuery.trim();
    }

    return payload;
  };

  const getOrders = async (
    currentTabValue = tabValue,
    pageNumber = page,
    query = searchQuery
  ) => {
    showLoader();
    try {
      const payload = constructGetOrdersPayload(
        currentTabValue,
        pageNumber,
        pageSize,
        query
      );
      const response = await axios.post(
        `${API_BASE_URL}/orders/getorderdeliverdetails`,
        payload
      );
      const pageSizeFromRes = response?.data?.pageSize || 0;
      const totalRecords = response?.data?.totalRecords || 0;
      const totalPages = Math.ceil(totalRecords / pageSizeFromRes);

      setOrders(response?.data?.orders || []);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    getOrders();
  }, [tabValue, page, searchQuery]);

  function navigateToOrderStatus(orderId: number) {
    localStorage.setItem(
      LocalStorageKeys.ORDER_DETAILS,
      JSON.stringify({
        orderId,
      })
    );
    navigate(`/order/status`);
  }

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title="Orders"
          action={
            <TextField
              fullWidth
              placeholder="Search order"
              variant="outlined"
              size="small"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  getOrders(tabValue, 1, searchQuery);
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
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => {
              setTabValue(newValue);
              setPage(1);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>

          <List>
            {orders.length > 0 ? (
              orders.map((order) => (
                <ListItem
                  key={order.orderId}
                  divider
                  sx={{
                    justifyContent: "space-between",
                  }}
                  className={`d-flex align-items-center cursor-pointer gap-0-8 ${styles.listItemHover}`}
                  onClick={() => navigateToOrderStatus(order.orderId)}
                >
                  <div className="flex-1">
                    <OrderPreviewListItemText
                      primaryText={`ID: ${order.orderId}`}
                      secondaryText={`${order.senderName} - ${order.receiverName}`}
                      tertiaryText={formatDateCustom(order.deliveryDate)}
                    />
                  </div>
                  <div>
                    <OrderStatusIndicator status={order.orderStatus} />
                  </div>
                </ListItem>
              ))
            ) : (
              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                No orders found.
              </p>
            )}
          </List>

          {totalPages > pageSize && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
