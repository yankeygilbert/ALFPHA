import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Navigate, Routes, Route, Outlet } from "react-router-dom";
import { useCallback, useEffect } from "react";

// Import layouts
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { ResetPassword } from "./pages/ResetPassword";
import { getDocuments } from "./redux/slices/authSlice";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useSelector((state: any) => state); // Save state to storage
  return <>{isLoggedIn ? <Outlet /> : <Navigate to={"/"} />}</>;
};
const RestrictedRoutes = () => {
  const { isLoggedIn } = useSelector((state: any) => state);
  return <>{!isLoggedIn ? <Outlet /> : <Navigate to={"/dashboard"} />}</>;
};

function App() {
  const dispatch = useDispatch<any>();
  const initApp = useCallback(async () => {
    // Move to the dashboard
    await dispatch(getDocuments());
  }, [dispatch]);

  useEffect(() => {
    initApp();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route element={<RestrictedRoutes />}>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="*" element={<Landing />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
