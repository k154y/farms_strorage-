import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllDocuments, reviewDocument } from "../../services/documentService";

export default function AdminVerificationDocumentsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionComments, setRejectionComments] = useState({});

  const loadItems = async () => {
    try {
      const data = await getAllDocuments();
      setItems(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load documents");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleReview = async (id, status) => {
    try {
      setError("");
      setMessage("");

      if (status === "REJECTED") {
        const comment = (rejectionComments[id] || "").trim();

        if (!comment) {
          setError("Please add a rejection reason so the user can understand what needs to be fixed.");
          return;
        }

        await reviewDocument(id, status, comment);
        setRejectionComments((current) => ({ ...current, [id]: "" }));
        setRejectingId(null);
        setMessage("Document rejected and the reason was sent to the user notification inbox.");
      } else {
        await reviewDocument(id, status);
        setMessage("Document approved successfully.");
      }

      await loadItems();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to review document");
    }
  };

  const isValidRemoteUrl = (value) =>
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://")) &&
    value !== "cloudinary-url-placeholder";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900"></h2>
      <p className="mt-2 text-slate-500">Uploaded document to be reviewed.</p>
      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-slate-500">No uploaded documents found.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{item.user?.fullName || "Unknown user"}</p>
                  <p className="text-sm text-slate-500">{item.user?.email || "No email"}</p>
                  <p className="text-sm text-slate-500">Role: {item.user?.role || "UNKNOWN"}</p>
                  <p className="text-sm text-slate-500">Type: {item.documentType}</p>
                  <p className="text-sm text-slate-500">File: {item.fileName}</p>
                  {isValidRemoteUrl(item.filePath) ? (
                    <a
                      href={item.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[#47A369] underline"
                    >
                      Open uploaded document
                    </a>
                  ) : item.filePath ? (
                    <p className="text-sm text-amber-700">
                      This is an older placeholder record. The user needs to re-upload the document.
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">No stored document URL</p>
                  )}
                  <div className="pt-1">
                    <StatusBadge status={item.status} />
                  </div>
                  {item.comment && (
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Last review comment:</span> {item.comment}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-md space-y-3">
                  {rejectingId === item.id && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Rejection reason
                        <textarea
                          value={rejectionComments[item.id] || ""}
                          onChange={(event) =>
                            setRejectionComments((current) => ({
                              ...current,
                              [item.id]: event.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Explain what is wrong with this document and what the user should upload instead."
                          className="mt-2 w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-slate-700"
                        />
                      </label>
                      <p className="mt-2 text-xs text-slate-500">
                        This reason will be sent to the manager or transporter in their notifications.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReview(item.id, "APPROVED")}
                      className="rounded-lg bg-[#47A369] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Approve
                    </button>
                    {rejectingId === item.id ? (
                      <>
                        <button
                          onClick={() => handleReview(item.id, "REJECTED")}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectionComments((current) => ({ ...current, [item.id]: "" }));
                            setError("");
                          }}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setRejectingId(item.id);
                          setMessage("");
                          setError("");
                        }}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
