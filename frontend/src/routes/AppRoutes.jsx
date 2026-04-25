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
import BookingHistoryPage from "../pages/farmer/BookingHistoryPage";
import BookingDetailPage from "../pages/farmer/BookingDetailPage";
import FarmerCreateBookingPage from "../pages/farmer/FarmerCreateBookingPage";
import MyListingsPage from "../pages/farmer/MyListingsPage";
import CreateListingPage from "../pages/farmer/CreateListingPage";
import OrdersReceivedPage from "../pages/farmer/OrdersReceivedPage";
import FarmerNotificationsPage from "../pages/farmer/FarmerNotificationsPage";
import FarmerProfilePage from "../pages/farmer/FarmerProfilePage";
import StorageDashboard from "../pages/storage/StorageDashboard";
import FacilitiesPage from "../pages/storage/StorageFacility";
import AddFacilityPage from "../pages/storage/AddFacilityPage";
import FacilityDetailPage from "../pages/storage/FacilityDetailPage";
import ColdRoomsPage from "../pages/storage/ColdRoomsPage";
import BookingRequestsPage from "../pages/storage/BookingRequestsPage";
import StorageNotificationsPage from "../pages/storage/StorageNotificationsPage";
import StorageProfilePage from "../pages/storage/StorageProfilePage";
import TransporterDashboard from "../pages/transport/TransporterDashboard";
import VehiclesPage from "../pages/transport/VehiclesPage";
import AddVehiclePage from "../pages/transport/AddVehiclePage";
import TransportRequestsPage from "../pages/transport/TransportRequestsPage";
import TransportRequestDetailPage from "../pages/transport/TransportRequestDetailPage";
import TransportProfilePage from "../pages/transport/TransportProfilePage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import PendingApprovalsPage from "../pages/admin/PendingApprovalsPage";
import AdminVerificationDocumentsPage from "../pages/admin/AdminVerificationDocumentsPage";
import AdminNotificationsPage from "../pages/admin/AdminNotificationsPage";
import AdminAuditLogsPage from "../pages/admin/AdminAuditLogsPage";
import NotFoundPage from "../pages/NotFoundPage";
import HowItWorksPage from "../pages/public/HowItWorksPage";

function TransportNotificationsPage() {
  return <div className="rounded-2xl bg-white p-6 shadow-sm">Transport notifications page.</div>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-storage" element={<RegisterStoragePage />} />
        <Route path="/find-storage" element={<BookStoragePage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleRoute allowedRoles={["FARMER"]} />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/bookings" element={<BookingHistoryPage />} />
            <Route path="/farmer/findstorage" element={<BookStoragePage/>}/>
            <Route path="/farmer/bookings/create" element={<FarmerCreateBookingPage />} />
            <Route path="/farmer/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/farmer/listings" element={<MyListingsPage />} />
            <Route path="/farmer/listings/create" element={<CreateListingPage />} />
            <Route path="/farmer/orders" element={<OrdersReceivedPage />} />
            <Route path="/farmer/notifications" element={<FarmerNotificationsPage />} />
            <Route path="/farmer/profile" element={<FarmerProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["STORAGE_MANAGER"]} />}>
            <Route path="/storage/dashboard" element={<StorageDashboard />} />
            <Route path="/storage/facilities" element={<FacilitiesPage />} />
            <Route path="/storage/facilities/create" element={<AddFacilityPage />} />
            <Route path="/storage/facilities/:id" element={<FacilityDetailPage />} />
            <Route path="/storage/cold-rooms" element={<ColdRoomsPage />} />
            <Route path="/storage/booking-requests" element={<BookingRequestsPage />} />
            <Route path="/storage/notifications" element={<StorageNotificationsPage />} />
            <Route path="/storage/profile" element={<StorageProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["TRANSPORTER"]} />}>
            <Route path="/transport/dashboard" element={<TransporterDashboard />} />
            <Route path="/transport/vehicles" element={<VehiclesPage />} />
            <Route path="/transport/vehicles/create" element={<AddVehiclePage />} />
            <Route path="/transport/requests" element={<TransportRequestsPage />} />
            <Route path="/transport/requests/:id" element={<TransportRequestDetailPage />} />
            <Route path="/transport/notifications" element={<TransportNotificationsPage />} />
            <Route path="/transport/profile" element={<TransportProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="/admin/verification-documents" element={<AdminVerificationDocumentsPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
