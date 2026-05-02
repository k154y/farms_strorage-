import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("This reset link is missing its token.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await resetPassword({ token, newPassword: form.newPassword });
      setMessage(data?.message || "Your password has been reset.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Password reset failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF8] px-6 py-12">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#E5E7EB] bg-white p-8 shadow-[0_24px_80px_rgba(48,79,58,0.08)]">
        <h1 className="text-3xl font-black text-[#1F2937]">Reset Password</h1>
        <p className="mt-3 text-sm text-[#6B7280]">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#1F2937]"
            value={form.newPassword}
            onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#1F2937]"
            value={form.confirmPassword}
            onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            required
          />

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {message ? <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#47A369] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#3D945D] disabled:opacity-70"
          >
            {submitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#6B7280]">
          Back to{" "}
          <Link to="/login" className="font-semibold text-[#47A369]">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}
