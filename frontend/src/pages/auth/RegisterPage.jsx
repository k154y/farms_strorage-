import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  registerWithGoogleUser,
  registerFarmer,
  registerStorageManager,
  registerTransporter,
} from "../../services/authService";
import {
  getGoogleClientId,
  hasGoogleClientId,
  loadGoogleIdentityScript,
  parseGoogleCredential,
} from "../../utilis/googleIdentity";

const ROLE_OPTIONS = [
  {
    value: "FARMER",
    label: "Farmer",
    description: "Book storage and manage produce.",
  },
  {
    value: "STORAGE_MANAGER",
    label: "Storage Manager",
    description: "Manage facilities and cold rooms.",
  },
  {
    value: "TRANSPORTER",
    label: "Transporter",
    description: "Handle transport requests and vehicles.",
  },
];

const initialForm = {
  role: "FARMER",
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  district: "",
  sector: "",
  businessName: "",
  ownerName: "",
  contactPhone: "",
  drivingLicenseNumber: "",
};

function InputField({ label, error = "", className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#47A369] focus:bg-white focus:ring-4 focus:ring-[#47A369]/10 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      />
      {error ? <span className="mt-2 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error = "",
  placeholder,
  show,
  onToggle,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#47A369] focus:bg-white focus:ring-4 focus:ring-[#47A369]/10 ${
            error ? "border-red-300" : "border-slate-200"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-700"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
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
      {error ? <span className="mt-2 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function submitLabel(role) {
  if (role === "STORAGE_MANAGER") return "Create Storage Manager Account";
  if (role === "TRANSPORTER") return "Create Transporter Account";
  return "Create Farmer Account";
}

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [googleEnabled, setGoogleEnabled] = useState(hasGoogleClientId());
  const [googleReady, setGoogleReady] = useState(false);
  const [googleSignupToken, setGoogleSignupToken] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const googleButtonRef = useRef(null);

  const isApprovalRole = form.role === "STORAGE_MANAGER" || form.role === "TRANSPORTER";

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    if (name === "email") {
      setShowResendVerification(false);
    }
  };

  const isGoogleSignup = Boolean(googleSignupToken);

  const validate = ({ requirePassword = true } = {}) => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    if (requirePassword) {
      if (!form.password) nextErrors.password = "Password is required.";
      if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = "Passwords do not match.";
      }
    }

    if (form.role === "FARMER") {
      if (!form.district.trim()) nextErrors.district = "District is required.";
      if (!form.sector.trim()) nextErrors.sector = "Sector is required.";
    }

    if (form.role === "STORAGE_MANAGER") {
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    if (form.role === "TRANSPORTER") {
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGoogleCredential = useEffectEvent(async (credential) => {
    if (!credential) {
      setError("Google sign-up did not return a valid credential.");
      return;
    }

    const profile = parseGoogleCredential(credential);
    const nextFullName = profile?.name || form.fullName;
    const nextEmail = profile?.email || form.email;

    setGoogleSignupToken(credential);
    setForm((current) => ({
      ...current,
      fullName: nextFullName,
      email: nextEmail,
    }));
    setErrors((current) => ({
      ...current,
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }));
    setMessage("");
    setError("");
    setShowResendVerification(false);
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate({ requirePassword: !isGoogleSignup })) return;

    setSubmitting(true);
    setMessage("");
    setError("");
    setShowResendVerification(false);

    try {
      if (isGoogleSignup) {
        const data = await registerWithGoogleUser({
          idToken: googleSignupToken,
          role: form.role,
          fullName: form.fullName.trim(),
          phoneNumber: form.phoneNumber.trim(),
          businessName: form.businessName.trim(),
          ownerName: form.ownerName.trim(),
          contactPhone: form.contactPhone.trim(),
          drivingLicenseNumber: form.drivingLicenseNumber.trim(),
          district: form.district.trim(),
          sector: form.sector.trim(),
          village: "",
          farmLocationDescription: "",
        });
        setMessage(data?.message || "Account created with Google. Please confirm your email before logging in.");
        return;
      }

      if (form.role === "FARMER") {
        await registerFarmer({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
          district: form.district.trim(),
          sector: form.sector.trim(),
        });
      } else if (form.role === "STORAGE_MANAGER") {
        await registerStorageManager({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
          businessName: form.businessName.trim(),
          ownerName: form.ownerName.trim(),
          district: form.district.trim(),
          sector: form.sector.trim(),
          contactPhone: form.contactPhone.trim(),
        });
      } else {
        await registerTransporter({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
          businessName: form.businessName.trim(),
          drivingLicenseNumber: form.drivingLicenseNumber.trim(),
          district: form.district.trim(),
          sector: form.sector.trim(),
          contactPhone: form.contactPhone.trim(),
        });
      }

      setMessage(
        isApprovalRole
          ? "Account created. Please confirm your email before login, then finish profile details and upload verification documents."
          : "Farmer account created successfully. Please confirm your email before logging in."
      );
      setShowResendVerification(true);
    } catch (err) {
      const nextError = err?.response?.data?.message || err?.message || "Registration failed";
      setError(nextError);
      if (nextError.toLowerCase().includes("resend the confirmation email")) {
        setShowResendVerification(true);
      }
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
          text: "signup_with",
          width: 320,
        });
        setGoogleReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setGoogleEnabled(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [googleEnabled]);

  return (
    <div className="min-h-screen bg-[#f6f8f7] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative overflow-hidden bg-[#304F3A] px-8 py-10 text-white sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_32%)]" />
          <div className="relative inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#304F3A]">
              C
            </span>
            ColdChain
          </div>

          <div className="relative mt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              Join the platform
            </p>
          
          
          </div>

          <div className="relative mt-10 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold">Farmer</p>
              <p className="mt-1 text-sm leading-6 text-white/75">Quick access to storage booking and marketplace tools.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold">Storage Manager</p>
              <p className="mt-1 text-sm leading-6 text-white/75">Create the account now, then complete business details and verification after login.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold">Transporter</p>
              <p className="mt-1 text-sm leading-6 text-white/75">Register first, then add transport details and approval documents from your profile.</p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="space-y-3">
            {/* <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#47A369]">
               Create your account
            </p> */}
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-black sm:text-[2rem]">
              Create your account
            </h2>
           
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {ROLE_OPTIONS.map((option) => {
              const selected = form.role === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setForm((current) => ({ ...current, role: option.value }));
                    setErrors({});
                    setError("");
                    setMessage("");
                    setGoogleSignupToken("");
                    setShowResendVerification(false);
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-[#47A369] bg-[#eef6f0] shadow-sm"
                      : "border-slate-200 hover:border-[#B9D8C1] hover:bg-[#f8faf8]"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{option.description}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div >
              {/* <p className="text-sm font-semibold text-[#304F3A]">
                Continue with Google as {ROLE_OPTIONS.find((option) => option.value === form.role)?.label}
              </p> */}
              {/* <p className="mt-1 text-sm leading-6 text-slate-500">
                Start with Google, then finish the remaining fields for the selected role.
              </p> */}
              {googleEnabled ? (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <div ref={googleButtonRef} className={googleReady ? "" : "min-h-[44px]"} />
                  {isGoogleSignup ? (
                    <div className="w-full rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                      Google account connected. Complete the remaining fields below, then submit.
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Add `VITE_GOOGLE_CLIENT_ID` to the frontend environment to enable Google sign-up.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                {/* <h3 className="text-base font-semibold text-slate-900">Basic details</h3>
                <p className="mt-1 text-sm text-slate-500">
                  These details identify the person or business creating the account.
                </p> */}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Full Name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                error={errors.fullName}
                placeholder="Full name"
                readOnly={isGoogleSignup}
              />
              <InputField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                error={errors.email}
                placeholder="Email address"
                readOnly={isGoogleSignup}
              />
              <InputField
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(event) => updateField("phoneNumber", event.target.value)}
                error={errors.phoneNumber}
                placeholder="Phone number"
              />
              {!isGoogleSignup ? (
                <>
                  <PasswordField
                    label="Password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    error={errors.password}
                    placeholder="Create a password"
                    show={showPassword}
                    onToggle={() => setShowPassword((current) => !current)}
                  />
                  <PasswordField
                    label="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    error={errors.confirmPassword}
                    placeholder="Repeat your password"
                    show={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((current) => !current)}
                    className="md:col-span-2"
                  />
                </>
              ) : null}
            </div>
            </div>

            <div className="space-y-4">
              <div>
                {/* <h3 className="text-base font-semibold text-slate-900">
                  {form.role === "FARMER" ? "Location details" : "Role details"}
                </h3> */}
                {/* <p className="mt-1 text-sm text-slate-500">
                  {form.role === "FARMER"
                    ? "Tell us where your farming activity is based."
                    : "Provide the details needed for this account type."}
                </p> */}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
              {form.role === "FARMER" && (
                <>
                  <InputField
                    label="District"
                    value={form.district}
                    onChange={(event) => updateField("district", event.target.value)}
                    error={errors.district}
                    placeholder="District"
                  />
                  <InputField
                    label="Sector"
                    value={form.sector}
                    onChange={(event) => updateField("sector", event.target.value)}
                    error={errors.sector}
                    placeholder="Sector"
                  />
                </>
              )}

             
              </div>
            </div>

            {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            {message ? <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
            {showResendVerification && form.email.trim() ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                Need a fresh confirmation email?{" "}
                <Link
                  to={`/resend-verification?email=${encodeURIComponent(form.email.trim())}`}
                  className="font-semibold text-[#47A369]"
                >
                  Resend confirmation email
                </Link>
              </div>
            ) : null}

            {isApprovalRole ? (
              <p className="text-sm leading-6 text-slate-500">
                Storage managers and transporters will finish business details and verification documents after login.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#304F3A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3f684c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Creating account..."
                : isGoogleSignup
                  ? `Complete Google ${ROLE_OPTIONS.find((option) => option.value === form.role)?.label} Account`
                  : submitLabel(form.role)}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#47A369]">
                Log in here
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
