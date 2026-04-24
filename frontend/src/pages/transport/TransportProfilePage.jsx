import { useEffect, useState } from "react";
import { getMyDocuments, uploadDocument } from "../../services/documentService";
import { getUser } from "../../utilis/auth";

const transporterDocumentTypes = [
  "DRIVING_LICENSE",
  "VEHICLE_REGISTRATION",
  "TRANSPORT_LICENSE",
  "VEHICLE_INSPECTION_CERTIFICATE",
  "NATIONAL_ID",
  "OTHER",
];

export default function TransportProfilePage() {
  const user = getUser();
  const [type, setType] = useState(transporterDocumentTypes[0]);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      const data = await getMyDocuments();
      setItems(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load documents");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await uploadDocument({ file, type });
      setMessage("Document uploaded. Admin can now review your account.");
      setFile(null);
      event.target.reset();
      await loadDocuments();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Transporter Profile</h2>
        <p className="mt-2 text-slate-500">
          Your account status is <span className="font-semibold">{user?.status || "UNKNOWN"}</span>. Upload the required documents here, then wait for admin approval before farmers can work with your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Upload Verification Document</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            {transporterDocumentTypes.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
        </div>

        {message && <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 rounded-xl bg-[#47A369] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Uploading..." : "Upload Document"}
        </button>
      </form>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Submitted Documents</h3>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-slate-500">No documents uploaded yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 px-4 py-3">
                <p className="font-medium text-slate-900">{item.documentType}</p>
                <p className="mt-1 text-sm text-slate-500">Status: {item.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
