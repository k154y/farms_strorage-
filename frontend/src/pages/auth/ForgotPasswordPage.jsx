import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const data = await forgotPassword(email.trim());
      setMessage(data?.message || "A password reset email has been sent.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Could not send reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF8] px-6 py-12">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#E5E7EB] bg-white p-8 shadow-[0_24px_80px_rgba(48,79,58,0.08)]">
        <h1 className="text-3xl font-black text-[#1F2937]">Forgot Password</h1>
        <p className="mt-3 text-sm text-[#6B7280]">
          Enter the email you used when creating your account. If it exists, we will send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#1F2937]"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          {message ? <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-[#47A369] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#3D945D] disabled:opacity-70"
          >
            {submitting ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#6B7280]">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-[#47A369]">
            Go back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
