import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerFarmer,
  registerStorageManager,
  registerTransporter,
} from "../../services/authService";

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
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isApprovalRole = form.role === "STORAGE_MANAGER" || form.role === "TRANSPORTER";

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
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
          ? "Account created. Log in next to finish profile details and upload verification documents."
          : "Farmer account created successfully. You can now log in."
      );

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

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
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Full Name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                error={errors.fullName}
                placeholder="Full name"
              />
              <InputField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                error={errors.email}
                placeholder="Email address"
              />
              <InputField
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(event) => updateField("phoneNumber", event.target.value)}
                error={errors.phoneNumber}
                placeholder="Phone number"
              />
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
              {submitting ? "Creating account..." : submitLabel(form.role)}
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
