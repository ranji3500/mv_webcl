import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "/src/assets/icons/home.svg?react";
import DocSheetIcon from "/src/assets/icons/doc_sheet.svg?react";
import CartIcon from "/src/assets/icons/cart.svg?react";
import styles from "./AppMenu.module.css"; // Import CSS module

const AppMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname); // Sync active tab with route
  }, [location]);

  const getIcon = (
    IconComponent: React.FC<React.SVGProps<SVGSVGElement>>,
    isActive: boolean
  ) => <IconComponent className={isActive ? styles.iconActive : styles.icon} />;

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
        navigate(newValue);
      }}
      sx={{
        position: "static",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <BottomNavigationAction
        label="Home"
        value="/home"
        icon={getIcon(HomeIcon, value === "/")}
      />
      <BottomNavigationAction
        label="Orders"
        value="/orders"
        icon={getIcon(CartIcon, value === "/orders")}
      />
      <BottomNavigationAction
        label="Bills"
        value="/bills"
        icon={getIcon(DocSheetIcon, value === "/bills")}
      />
    </BottomNavigation>
  );
};

export default AppMenu;
