import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Marketplace", path: "/marketplace" },
    { label: "Find Storage", path: "/find-storage" },
    { label: "How It Works", path: "/how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-[1.45rem] font-semibold tracking-[-0.04em] text-[#1a202c]">
          ColdChain
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-slate-600 transition hover:text-[#2f855a]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a202c] shadow-sm transition hover:border-[#2f855a]/30 hover:text-[#2f855a]"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-xl border border-slate-200 p-2 text-slate-700 shadow-sm md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/98 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-[#1a202c] shadow-sm transition hover:border-[#2f855a]/30 hover:text-[#2f855a]"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
