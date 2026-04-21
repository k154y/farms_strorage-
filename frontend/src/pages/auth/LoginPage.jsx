import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    const fakeUser = {
      fullName: "Demo User",
      role: "FARMER",
      email: form.email,
    };

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(fakeUser));

    navigate("/farmer/dashboard");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div
        className="hidden lg:flex flex-col justify-between bg-cover bg-center p-12 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(48,79,58,0.75), rgba(48,79,58,0.75)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1400&auto=format&fit=crop')",
        }}
      >
        <div className="text-3xl font-bold">ColdChain</div>
        <div>
          <h1 className="max-w-xl text-6xl font-black leading-tight">
            Secure the harvest of the digital age.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">
            Smart storage, transport, and marketplace tools for modern agriculture.
          </p>
        </div>
        <div className="flex gap-12 text-white/90">
          <div>
            <p className="text-4xl font-black">99.9%</p>
            <p>Uptime Precision</p>
          </div>
          <div>
            <p className="text-4xl font-black">1.2M</p>
            <p>Units Managed</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-slate-900">Login</h2>
          <p className="mt-3 text-slate-500">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="w-full rounded-xl bg-[#304F3A] px-6 py-3 font-semibold text-white hover:bg-[#47A369]">
              Harvest Access
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            New here?{" "}
            <Link to="/register" className="font-semibold text-[#47A369]">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}