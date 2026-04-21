import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-black text-[#304F3A]">404</h1>
      <p className="mt-4 text-slate-600">Page not found.</p>
      <Link to="/" className="mt-6 rounded-xl bg-[#47A369] px-6 py-3 font-semibold text-white">
        Back Home
      </Link>
    </div>
  );
}