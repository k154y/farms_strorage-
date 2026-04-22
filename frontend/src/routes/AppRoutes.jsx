import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layout/PublicLayout";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import LandingPage from "../pages/LandingPage";
import MarketplacePage from "../pages/marketplace/MarketplacePage";
import ProductDetailsPage from "../pages/marketplace/ProductDetailsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RegisterStoragePage from "../pages/storage/RegisterStoragePage";
import BookStoragePage from "../pages/booking/BookStoragePage";

import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import StorageDashboard from "../pages/storage/StorageDashboard";
import TransporterDashboard from "../pages/transport/TransporterDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-storage" element={<RegisterStoragePage />} />
        <Route path="/find-storage" element={<BookStoragePage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleRoute allowedRoles={["FARMER"]} />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["STORAGE_MANAGER"]} />}>
            <Route path="/storage/dashboard" element={<StorageDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["TRANSPORTER"]} />}>
            <Route path="/transport/dashboard" element={<TransporterDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
