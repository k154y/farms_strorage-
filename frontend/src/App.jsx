// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/auth/LoginPage";
// import RegisterPage from "./pages/auth/RegisterPage";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import FarmerDashboard from "./pages/farmer/FarmerDashboard";
// import StorageFacilityPage from "./pages/storage/StorageFacilityPage";
// import BookingPage from "./pages/booking/BookingPage";
// import TransportPage from "./pages/transport/TransportPage";
// import MarketplacePage from "./pages/marketplace/MarketplacePage";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/farmer" element={<FarmerDashboard />} />
//         <Route path="/storage-facilities" element={<StorageFacilityPage />} />
//         <Route path="/bookings" element={<BookingPage />} />
//         <Route path="/transport" element={<TransportPage />} />
//         <Route path="/marketplace" element={<MarketplacePage />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;