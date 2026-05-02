import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmailToken } from "../../services/authService";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    if (!token) {
      return;
    }

    verifyEmailToken(token)
      .then((data) => {
        setStatus("success");
        setMessage(data?.message || "Your email has been confirmed.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err?.response?.data?.message || err?.message || "Email verification failed.");
      });
  }, [token]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAF8] px-6 py-12">
        <div className="w-full max-w-lg rounded-[2rem] border border-[#E5E7EB] bg-white p-8 shadow-[0_24px_80px_rgba(48,79,58,0.08)]">
          <h1 className="text-3xl font-black text-[#1F2937]">Email Confirmation</h1>
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-4 text-sm text-red-700">
            This verification link is missing its token.
          </div>
          <div className="mt-6">
            <Link to="/login" className="font-semibold text-[#47A369]">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF8] px-6 py-12">
      <div className="w-full max-w-lg rounded-[2rem] border border-[#E5E7EB] bg-white p-8 shadow-[0_24px_80px_rgba(48,79,58,0.08)]">
        <h1 className="text-3xl font-black text-[#1F2937]">Email Confirmation</h1>
        <div
          className={`mt-6 rounded-2xl px-4 py-4 text-sm ${
            status === "success" ? "bg-green-50 text-green-700" : status === "error" ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-700"
          }`}
        >
          {message}
        </div>
        <div className="mt-6">
          <Link to="/login" className="font-semibold text-[#47A369]">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}
