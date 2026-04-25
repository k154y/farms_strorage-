import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getTransportHistory,
  getTransportRequestById,
  updateTransportRequestStatus,
} from "../../services/transportService";
import { getUser } from "../../utilis/auth";

const STATUS_OPTIONS = {
  ASSIGNED: ["ACCEPTED", "CANCELLED"],
  ACCEPTED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["DELIVERED"],
  DELIVERED: ["COMPLETED"],
};

function formatDateTime(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

function formatDate(value) {
  if (!value) return "Not specified";
  return new Date(value).toLocaleDateString();
}

function formatStatusLabel(status) {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function buildDetailRows(request) {
  return [
    { label: "Pickup location", value: request.pickupLocation || "Not available" },
    { label: "Delivery location", value: request.destinationLocation || "Not available" },
    { label: "Quantity to transport", value: request.quantityToTransport ?? "Not available" },
    { label: "Preferred pickup date", value: formatDate(request.preferredPickupDate) },
    { label: "Created", value: formatDateTime(request.createdAt) },
    { label: "Last updated", value: formatDateTime(request.updatedAt) },
  ];
}

export default function TransportRequestDetailPage() {
  const { id } = useParams();
  const user = getUser();
  const [request, setRequest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const loadData = async () => {
    const [requestData, historyData] = await Promise.all([
      getTransportRequestById(id),
      getTransportHistory(id).catch(() => []),
    ]);

    setRequest(requestData);
    setHistory(historyData || []);
    return requestData;
  };

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    loadData()
      .then((requestData) => {
        if (!active) return;
        const allowedStatuses = STATUS_OPTIONS[requestData?.status] || [];
        setNextStatus(allowedStatuses[0] || "");
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load transport request details");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (left, right) => new Date(right.changedAt || 0) - new Date(left.changedAt || 0)
      ),
    [history]
  );

  const allowedStatuses = STATUS_OPTIONS[request?.status] || [];
  const detailRows = request ? buildDetailRows(request) : [];

  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    if (!nextStatus) {
      setError("Please select the next status for this request.");
      return;
    }

    setSavingStatus(true);
    setError("");
    setMessage("");

    try {
      const updatedRequest = await updateTransportRequestStatus(id, {
        status: nextStatus,
        changedByUserId: user?.id,
        comment: statusComment.trim(),
      });

      const updatedHistory = await getTransportHistory(id).catch(() => []);
      setRequest(updatedRequest);
      setHistory(updatedHistory || []);

      const nextAllowedStatuses = STATUS_OPTIONS[updatedRequest?.status] || [];
      setNextStatus(nextAllowedStatuses[0] || "");
      setStatusComment("");
      setMessage(`Transport request moved to ${formatStatusLabel(updatedRequest.status)}.`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to update the transport status");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
        Loading transport request details...
      </div>
    );
  }

  if (error && !request) {
    return <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>;
  }

  if (!request) {
    return (
      <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
        Transport request not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#47A369]">
              Assigned Request Detail
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Transport Request #{request.id}</h2>
            <p className="mt-2 max-w-3xl text-slate-500">
              Review the farmer details, assigned vehicle, linked booking, movement locations, and the full transport progress in one place.
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Request Overview</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {detailRows.map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
            {request.notes && (
              <div className="mt-4 rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900">Farmer Notes</p>
                <p className="mt-2 text-sm text-slate-600">{request.notes}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Farmer and Booking Details</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Farmer:</span> {request.farmer?.fullName || "Not available"}</p>
                <p><span className="font-semibold text-slate-900">Email:</span> {request.farmer?.email || "Not available"}</p>
                <p><span className="font-semibold text-slate-900">Phone:</span> {request.farmer?.phoneNumber || "Not available"}</p>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Linked booking:</span> {request.booking ? `#${request.booking.id}` : "Transport only request"}</p>
                <p><span className="font-semibold text-slate-900">Facility:</span> {request.booking?.facility?.name || "Not linked to a storage booking"}</p>
                <p><span className="font-semibold text-slate-900">Produce type:</span> {request.booking?.produceCategory?.name || "Not available"}</p>
                <p><span className="font-semibold text-slate-900">Booked quantity:</span> {request.booking?.quantity ?? "Not available"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Transport Assignment</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Assigned transporter:</span> {request.transporter?.fullName || "Not assigned"}</p>
              <p><span className="font-semibold text-slate-900">Transporter email:</span> {request.transporter?.email || "Not available"}</p>
              <p><span className="font-semibold text-slate-900">Vehicle plate number:</span> {request.vehicle?.plateNumber || "Not assigned"}</p>
              <p><span className="font-semibold text-slate-900">Vehicle type:</span> {request.vehicle?.vehicleType || "Not assigned"}</p>
              <p><span className="font-semibold text-slate-900">Vehicle capacity:</span> {request.vehicle?.capacity ?? "Not assigned"}</p>
              <p><span className="font-semibold text-slate-900">Vehicle status:</span> {request.vehicle?.active ? "Active" : request.vehicle ? "Inactive" : "Not assigned"}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Update Progress</h3>
            {allowedStatuses.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                This request is already in a final state, so there are no more transporter actions available.
              </p>
            ) : (
              <form className="mt-4 space-y-4" onSubmit={handleStatusUpdate}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Next status</span>
                  <select
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Comment</span>
                  <textarea
                    value={statusComment}
                    onChange={(event) => setStatusComment(event.target.value)}
                    rows={4}
                    placeholder="Add pickup notes, delivery remarks, or explain a cancellation."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </label>

                <button
                  type="submit"
                  disabled={savingStatus}
                  className="w-full rounded-xl bg-[#47A369] px-4 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {savingStatus ? "Saving update..." : "Save status update"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Transport Timeline</h3>
        {sortedHistory.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No history entries have been recorded yet. The request is currently{" "}
            <span className="font-semibold">{formatStatusLabel(request.status)}</span>.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {sortedHistory.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-slate-500">{item.oldStatus || "Created"}</span>
                    <span className="text-slate-300">to</span>
                    <StatusBadge status={item.newStatus} />
                  </div>
                  <span className="text-sm text-slate-500">{formatDateTime(item.changedAt)}</span>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Changed by:</span> {item.changedByUser?.fullName || item.changedByUser?.email || "System"}</p>
                  {item.comment && <p><span className="font-semibold text-slate-900">Comment:</span> {item.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
