import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, User, X } from "lucide-react";

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Marketplace", path: "/marketplace" },
    { label: "Find Storage", path: "/find-storage" },
    { label: "How It Works", path: "/how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-bold text-[#304F3A]">ColdChain</Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="hover:text-[#47A369]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Bell size={18} className="text-slate-600" />
          <User size={18} className="text-slate-600" />
          <Link to="/login" className="rounded-lg bg-[#47A369] px-4 py-2 text-sm font-semibold text-white">
            Login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Bell size={18} />
                <User size={18} />
              </div>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#47A369] px-4 py-2 text-sm font-semibold text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
