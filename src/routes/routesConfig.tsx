import Home from "../pages/Home";
import Orders from "../pages/Orders";
import Bills from "../pages/Bills";
import {
  BillingDetails,
  Commodities,
  OrderDetails,
  OrderStatus,
  OrderSuccess,
} from "../pages/sub-pages";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Register from "../pages/Register";

type AppRouteComponent = React.ComponentType<Record<string, unknown>>;

export type AppRoute = {
  path: string;
  label: string;
  component: AppRouteComponent;
  isUseSubLayout: boolean;
  isPublic?: boolean;
};
 

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Welcome",
    component: Welcome,
    isUseSubLayout: false,
    isPublic: true,
  },
  {
    path: "/login",
    label: "Login",
    component: Login,
    isUseSubLayout: false,
    isPublic: true,
  },
  {
    path: "/register",
    label: "Register",
    component: Register,
    isUseSubLayout: false,
    isPublic: true,
  },

  { path: "/home", label: "Home", component: Home, isUseSubLayout: false },
  {
    path: "/orders",
    label: "Orders",
    component: Orders,
    isUseSubLayout: false,
  },
  { path: "/bills", label: "Bills", component: Bills, isUseSubLayout: false },

  {
    path: "/order/details",
    label: "Create Order",
    component: OrderDetails,
    isUseSubLayout: true,
  },
  {
    path: "/order/commodities",
    label: "Create Order",
    component: Commodities,
    isUseSubLayout: true,
  },
  {
    path: "/order/bill",
    label: "Create Order",
    component: BillingDetails,
    isUseSubLayout: true,
  },
  {
    path: "/order/success",
    label: "Create Order",
    component: OrderSuccess,
    isUseSubLayout: true,
  },
  {
    path: "/order/status",
    label: "Order Status",
    component: OrderStatus,
    isUseSubLayout: true,
  },
];
