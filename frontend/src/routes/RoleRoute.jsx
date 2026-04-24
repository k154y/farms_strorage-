import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../utilis/auth";

export default function RoleRoute({ allowedRoles }) {
  const user = getUser();
  const location = useLocation();
  const status = user?.status || "ACTIVE";

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (user.role === "STORAGE_MANAGER" && status !== "ACTIVE" && location.pathname !== "/storage/profile") {
    return <Navigate to="/storage/profile" replace />;
  }

  if (user.role === "TRANSPORTER" && status !== "ACTIVE" && location.pathname !== "/transport/profile") {
    return <Navigate to="/transport/profile" replace />;
  }

  return <Outlet />;
}
