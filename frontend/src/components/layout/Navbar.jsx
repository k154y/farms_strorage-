import { Link, useNavigate } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { isAuthenticated } from "../../utilis/auth";

export default function PublicNavbar() {
  const navigate = useNavigate();

  const handleFindStorage = () => {
    if (!isAuthenticated()) return navigate("/login");
    navigate("/farmer/bookings/create");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-[#304F3A]">ColdChain</Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link to="/marketplace" className="hover:text-[#47A369]">Marketplace</Link>
          <Link to="/login"className="hover:text-[#47A369]">Find Storage</Link>
          <Link to="/how-it-works" className="hover:text-[#47A369]">How It Works</Link>
          
        </nav>

        <div className="flex items-center gap-4">
          <Bell size={18} className="text-slate-600" />
          <User size={18} className="text-slate-600" />
          <Link to="/login" className="rounded-lg bg-[#47A369] px-4 py-2 text-sm font-semibold text-white">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
