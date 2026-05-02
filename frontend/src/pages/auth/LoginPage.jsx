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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="grid min-h-screen bg-[#f6f8f7] lg:grid-cols-[1.05fr_0.95fr]">
      <div
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between bg-cover bg-center px-12 py-14 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(48,79,58,0.75), rgba(48,79,58,0.75)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1400&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%)]" />
        <div className="relative text-2xl font-semibold tracking-[-0.03em]">ColdChain</div>
        <div className="relative">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            Welcome back
          </p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.05em]">
            Secure the harvest of the digital age.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/82">
            Smart storage, transport, and marketplace tools for modern agriculture.
          </p>
        </div>
        <div className="relative flex gap-8 text-white/90">
          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
            <p className="text-3xl font-semibold tracking-[-0.04em]">99.9%</p>
            <p className="mt-1 text-sm text-white/70">Uptime precision</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
            <p className="text-3xl font-semibold tracking-[-0.04em]">1.2M</p>
            <p className="mt-1 text-sm text-white/70">Units managed</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10">
          <div className="space-y-3">
          
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-[2rem]">
             Login
            </h2>
            <p className="max-w-sm text-sm leading-6 text-slate-500 sm:text-[15px]">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email address</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#47A369] focus:bg-white focus:ring-4 focus:ring-[#47A369]/10"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>

            <label className="block space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <Link to="/forgot-password" className="text-sm font-semibold text-[#47A369]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-14 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#47A369] focus:bg-white focus:ring-4 focus:ring-[#47A369]/10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 5.09A10.94 10.94 0 0112 4.91c5.05 0 8.27 3.11 9.5 6.09a1.91 1.91 0 010 1.5 12.28 12.28 0 01-4.04 4.92"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.61 6.61A12.26 12.26 0 002.5 11a1.91 1.91 0 000 1.5C3.73 15.48 6.95 18.59 12 18.59c1.26 0 2.42-.19 3.48-.53"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12c1.23-2.98 4.45-6.09 9.5-6.09S20.27 9.02 21.5 12a1.91 1.91 0 010 1.5c-1.23 2.98-4.45 6.09-9.5 6.09S3.73 16.48 2.5 13.5a1.91 1.91 0 010-1.5z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={submitting}
              className="w-full rounded-2xl bg-[#304F3A] px-6 py-3.5 font-semibold text-white transition hover:bg-[#3f684c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

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
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                Google sign-in is hidden until `VITE_GOOGLE_CLIENT_ID` is added to the frontend environment.
              </div>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
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
