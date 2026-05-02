import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogleUser } from "../../services/authService";
import {
  getGoogleClientId,
  hasGoogleClientId,
  loadGoogleIdentityScript,
} from "../../utilis/googleIdentity";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(hasGoogleClientId());
  const googleButtonRef = useRef(null);

  const routeByRole = (role) => {
    switch (role) {
      case "STORAGE_MANAGER":
        return "/storage/dashboard";
      case "TRANSPORTER":
        return "/transport/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      default:
        return "/farmer/dashboard";
    }
  };

  const getPostLoginPath = (user) => {
    if (user.role === "STORAGE_MANAGER" && user.status !== "ACTIVE") return "/storage/profile";
    if (user.role === "TRANSPORTER" && user.status !== "ACTIVE") return "/transport/profile";
    return routeByRole(user.role);
  };

  const persistSession = (data) => {
    const user = {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      status: data.status,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));

    const nextPath = location.state?.from?.pathname || getPostLoginPath(user);
    navigate(nextPath, { replace: true });
  };

  const handleGoogleCredential = useEffectEvent(async (credential) => {
    if (!credential) {
      setError("Google sign-in did not return a valid credential.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const data = await loginWithGoogleUser(credential);
      persistSession(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Google sign-in failed");
    } finally {
      setSubmitting(false);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await loginUser(form);
      persistSession(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!googleEnabled || !googleButtonRef.current) {
      return undefined;
    }

    let cancelled = false;

    loadGoogleIdentityScript()
      .then((google) => {
        if (cancelled || !google?.accounts?.id || !googleButtonRef.current) {
          return;
        }

        google.accounts.id.initialize({
          client_id: getGoogleClientId(),
          callback: ({ credential }) => {
            handleGoogleCredential(credential);
          },
        });

        googleButtonRef.current.innerHTML = "";
        google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: "signin_with",
          width: 320,
        });
        setGoogleReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setGoogleEnabled(false);
          setError("Google sign-in is unavailable right now.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [googleEnabled]);

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
            Enter your credentials to access your account. New accounts must confirm their email before login.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={submitting}
              className="w-full rounded-xl bg-[#304F3A] px-6 py-3 font-semibold text-white hover:bg-[#47A369] disabled:opacity-70"
            >
              {submitting ? "Signing In..." : "Harvest Access"}
            </button>
          </form>

          <div className="mt-4 text-right text-sm">
            <Link to="/forgot-password" className="font-semibold text-[#47A369]">
              Forgot password?
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.25em] text-slate-400">
                <span className="bg-white px-3">or</span>
              </div>
            </div>

            {googleEnabled ? (
              <div className="mt-5 flex flex-col items-center gap-3">
                <div ref={googleButtonRef} className={googleReady ? "" : "min-h-[44px]"} />
                <p className="text-center text-sm text-slate-500">
                  Use Google with the same email as your existing account.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Google sign-in is hidden until `VITE_GOOGLE_CLIENT_ID` is added to the frontend environment.
              </div>
            )}
          </div>

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
