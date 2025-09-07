import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { appRoutes } from "./routes/routesConfig";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {appRoutes
          .filter((route) => route.isPublic)
          .map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout routeConfig={appRoutes} />}>
            {appRoutes
              .filter((route) => !route.isPublic)
              .map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path.slice(1)}
                  element={<Component />}
                />
              ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
