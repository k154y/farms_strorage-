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
      <span className="mb-2 block text-sm font-semibold text-[#304F3A]">{label}</span>
      <input
        {...props}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-[#1F2937] outline-none transition focus:border-[#47A369] focus:ring-4 focus:ring-[#47A369]/10 ${
          error ? "border-red-300" : "border-[#E5E7EB]"
        }`}
      />
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
      if (!form.businessName.trim()) nextErrors.businessName = "Business name is required.";
      if (!form.ownerName.trim()) nextErrors.ownerName = "Owner name is required.";
      if (!form.district.trim()) nextErrors.district = "District is required.";
      if (!form.sector.trim()) nextErrors.sector = "Sector is required.";
      if (!form.contactPhone.trim()) nextErrors.contactPhone = "Contact phone is required.";
    }

    if (form.role === "TRANSPORTER") {
      if (!form.businessName.trim()) nextErrors.businessName = "Business name is required.";
      if (!form.drivingLicenseNumber.trim()) {
        nextErrors.drivingLicenseNumber = "Driving license number is required.";
      }
      if (!form.district.trim()) nextErrors.district = "District is required.";
      if (!form.sector.trim()) nextErrors.sector = "Sector is required.";
      if (!form.contactPhone.trim()) nextErrors.contactPhone = "Contact phone is required.";
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
    <div className="min-h-screen bg-[#F8FAF8] px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white shadow-[0_24px_80px_rgba(48,79,58,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-[#304F3A] px-8 py-10 text-white sm:px-10">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#304F3A]">
              C
            </span>
            ColdChain
          </div>

         
          <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
            Create your account first, then complete profile details and verification after login.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm font-semibold">Farmer</p>
              <p className="mt-1 text-sm text-white/75">Quick access to storage and marketplace tools.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm font-semibold">Storage Manager</p>
              <p className="mt-1 text-sm text-white/75">Register now, upload documents after login.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm font-semibold">Transporter</p>
              <p className="mt-1 text-sm text-white/75">Create your account and complete verification later.</p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <h2 className="text-3xl font-black text-[#1F2937]">Create your account</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Choose your role and fill in the basic details below.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
                      ? "border-[#47A369] bg-[#EEF6F0]"
                      : "border-[#E5E7EB] hover:border-[#B9D8C1] hover:bg-[#F8FAF8]"
                  }`}
                >
                  <p className="text-sm font-bold text-[#1F2937]">{option.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">{option.description}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAF8] px-4 py-4">
              <p className="text-sm font-semibold text-[#304F3A]">
                Continue with Google as {ROLE_OPTIONS.find((option) => option.value === form.role)?.label}
              </p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Start with Google, then finish the remaining fields for the selected role.
              </p>
              {googleEnabled ? (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <div ref={googleButtonRef} className={googleReady ? "" : "min-h-[44px]"} />
                  {isGoogleSignup ? (
                    <div className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
                      Google account connected. Complete the remaining fields below, then submit.
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#6B7280]">
                  Add `VITE_GOOGLE_CLIENT_ID` to the frontend environment to enable Google sign-up.
                </p>
              )}
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
                  <InputField
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    error={errors.password}
                    placeholder="Password"
                  />
                  <InputField
                    label="Confirm Password"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    error={errors.confirmPassword}
                    placeholder="Confirm password"
                    className="md:col-span-2"
                  />
                </>
              ) : null}
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

              {form.role === "STORAGE_MANAGER" && (
                <>
                  <InputField
                    label="Business Name"
                    value={form.businessName}
                    onChange={(event) => updateField("businessName", event.target.value)}
                    error={errors.businessName}
                    placeholder="Business name"
                  />
                  <InputField
                    label="Owner Name"
                    value={form.ownerName}
                    onChange={(event) => updateField("ownerName", event.target.value)}
                    error={errors.ownerName}
                    placeholder="Owner name"
                  />
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
                  <InputField
                    label="Contact Phone"
                    value={form.contactPhone}
                    onChange={(event) => updateField("contactPhone", event.target.value)}
                    error={errors.contactPhone}
                    placeholder="Contact phone"
                    className="md:col-span-2"
                  />
                </>
              )}

              {form.role === "TRANSPORTER" && (
                <>
                  <InputField
                    label="Business Name"
                    value={form.businessName}
                    onChange={(event) => updateField("businessName", event.target.value)}
                    error={errors.businessName}
                    placeholder="Business name"
                  />
                  <InputField
                    label="Driving License Number"
                    value={form.drivingLicenseNumber}
                    onChange={(event) => updateField("drivingLicenseNumber", event.target.value)}
                    error={errors.drivingLicenseNumber}
                    placeholder="Driving license number"
                  />
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
                  <InputField
                    label="Contact Phone"
                    value={form.contactPhone}
                    onChange={(event) => updateField("contactPhone", event.target.value)}
                    error={errors.contactPhone}
                    placeholder="Contact phone"
                    className="md:col-span-2"
                  />
                </>
              )}
            </div>

            {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
            {message ? <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
            {showResendVerification && form.email.trim() ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
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
              <p className="text-sm text-[#6B7280]">
                Storage managers and transporters will finish verification documents after login.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#47A369] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#3D945D] disabled:opacity-70"
            >
              {submitting
                ? "Creating account..."
                : isGoogleSignup
                  ? `Complete Google ${ROLE_OPTIONS.find((option) => option.value === form.role)?.label} Account`
                  : submitLabel(form.role)}
            </button>

            <p className="text-center text-sm text-[#6B7280]">
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
