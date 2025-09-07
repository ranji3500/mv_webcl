import { Outlet, useLocation } from "react-router-dom";
import { Header, PageHeaderBar } from "../../components";
import AppMenu from "../../components/AppMenu";
import styles from "./MainLayout.module.css";
import { AppRoute } from "../../routes/routesConfig";

const MainLayout = ({ routeConfig }: { routeConfig: AppRoute[] }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const matchedRoute = routeConfig.find((route) => route.path === currentPath);

  const isSubFlow = matchedRoute?.isUseSubLayout ?? false;
  const label = matchedRoute?.label ?? "";

  const contentClass = `${styles.content} ${
    isSubFlow ? styles.contentNoPadding : styles.contentDefaultPadding
  }`;

  return (
    <div className={styles.container}>
      {isSubFlow ? <PageHeaderBar label={label} /> : <Header />}
      <div className={contentClass}>
        <Outlet />
      </div>
      <AppMenu />
    </div>
  );
};

export default MainLayout;
