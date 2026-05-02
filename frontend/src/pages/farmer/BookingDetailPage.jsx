import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getBookingById,
  getBookingHistory,
  updateBookingStatus,
} from "../../services/bookingService";
import {
  getTransportHistory,
  getTransportRequestsByBookingId,
} from "../../services/transportService";
import { getUser } from "../../utilis/auth";

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

function formatShortDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString();
}

export default function BookingDetailPage() {
  const { id } = useParams();
  const user = getUser();
  const [booking, setBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [transportRequests, setTransportRequests] = useState([]);
  const [transportHistoryByRequest, setTransportHistoryByRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getBookingById(id),
      getBookingHistory(id).catch(() => []),
      getTransportRequestsByBookingId(id).catch(() => []),
    ])
      .then(async ([bookingData, bookingHistoryData, transportRequestData]) => {
        if (!active) return;

        setMessage("");
        setBooking(bookingData);
        setBookingHistory(bookingHistoryData || []);
        setTransportRequests(transportRequestData || []);

        const historyEntries = await Promise.all(
          (transportRequestData || []).map(async (request) => {
            const history = await getTransportHistory(request.id).catch(() => []);
            return [request.id, history];
          })
        );

        if (!active) return;
        setTransportHistoryByRequest(Object.fromEntries(historyEntries));
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load booking details");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const latestBookingHistory = useMemo(
    () =>
      [...bookingHistory].sort(
        (left, right) => new Date(right.changedAt || 0) - new Date(left.changedAt || 0)
      ),
    [bookingHistory]
  );

  const canCancelBooking =
    booking?.farmer?.id === user?.id &&
    (booking?.status === "PENDING" || booking?.status === "APPROVED");

  const handleCancelBooking = async () => {
    if (!booking || !canCancelBooking) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel booking #${booking.id}? This will also cancel linked transport requests that have not started yet.`
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    setError("");
    setMessage("");

    try {
      const updatedBooking = await updateBookingStatus(booking.id, {
        status: "CANCELLED",
        changedByUserId: user?.id,
        comment: "Cancelled by farmer from booking detail page.",
      });

      setBooking(updatedBooking);
      const [bookingHistoryData, transportRequestData] = await Promise.all([
        getBookingHistory(booking.id).catch(() => []),
        getTransportRequestsByBookingId(booking.id).catch(() => []),
      ]);

      setBookingHistory(bookingHistoryData || []);
      setTransportRequests(transportRequestData || []);

      const historyEntries = await Promise.all(
        (transportRequestData || []).map(async (request) => {
          const history = await getTransportHistory(request.id).catch(() => []);
          return [request.id, history];
        })
      );

      setTransportHistoryByRequest(Object.fromEntries(historyEntries));
      setMessage("Booking cancelled successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-500">Loading booking details...</div>;
  }

  if (error) {
    return <div className="rounded-2xl bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>;
  }

  if (!booking) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-500">Booking not found.</div>;
  }

  return (
    <div className="space-y-6">
      {message && <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700 shadow-sm">{message}</div>}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#47A369]">Booking Detail</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Booking #{booking.id}</h2>
            <p className="mt-2 text-slate-500">
              Created on {formatDate(booking.createdAt)} and last updated on {formatDate(booking.updatedAt)}.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <StatusBadge status={booking.status} />
            {canCancelBooking ? (
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="cursor-pointer rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Storage Information</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Facility:</span> {booking.facility?.name || "Not available"}</p>
            <p><span className="font-semibold text-slate-900">Room:</span> {booking.coldRoom?.name || "Not available"} {booking.coldRoom?.code ? `(${booking.coldRoom.code})` : ""}</p>
            <p><span className="font-semibold text-slate-900">Produce type:</span> {booking.produceCategory?.name || "Not available"}</p>
            <p><span className="font-semibold text-slate-900">Quantity:</span> {booking.quantity}</p>
            <p><span className="font-semibold text-slate-900">Entry date:</span> {formatShortDate(booking.entryDate)}</p>
            <p><span className="font-semibold text-slate-900">Expected duration:</span> {booking.expectedDurationDays} day(s)</p>
            <p><span className="font-semibold text-slate-900">Price at booking:</span> {booking.priceAtBooking}</p>
            <p><span className="font-semibold text-slate-900">Estimated cost:</span> {booking.totalEstimatedCost}</p>
            <p><span className="font-semibold text-slate-900">Facility address:</span> {booking.facility?.address || "Not available"}</p>
            <p><span className="font-semibold text-slate-900">District:</span> {booking.facility?.district || "Not available"}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Farmer and Handling Details</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Farmer:</span> {booking.farmer?.fullName || "Not available"}</p>
            <p><span className="font-semibold text-slate-900">Email:</span> {booking.farmer?.email || "Not available"}</p>
            <p><span className="font-semibold text-slate-900">Phone:</span> {booking.farmer?.phoneNumber || "Not available"}</p>
            <p><span className="font-semibold text-slate-900">Current booking status:</span> {booking.status}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Booking Status Timeline</h3>
        {latestBookingHistory.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No status changes have been recorded yet. The booking is currently <span className="font-semibold">{booking.status}</span>.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {latestBookingHistory.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{item.oldStatus || "Created"}</span>
                    <span className="text-slate-300">to</span>
                    <StatusBadge status={item.newStatus} />
                  </div>
                  <span className="text-sm text-slate-500">{formatDate(item.changedAt)}</span>
                </div>
                {item.comment && <p className="mt-3 text-sm text-slate-600">{item.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Transport Requests Linked to This Booking</h3>
        {transportRequests.length === 0 ? (
          <p className="mt-4 text-slate-500">No transport request is linked to this booking.</p>
        ) : (
          <div className="mt-5 space-y-6">
            {transportRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Transport Request #{request.id}</h4>
                    <p className="mt-2 text-sm text-slate-600">Pickup: {request.pickupLocation}</p>
                    <p className="mt-1 text-sm text-slate-600">Destination: {request.destinationLocation}</p>
                    <p className="mt-1 text-sm text-slate-600">Quantity to transport: {request.quantityToTransport}</p>
                    <p className="mt-1 text-sm text-slate-600">Preferred pickup date: {formatShortDate(request.preferredPickupDate)}</p>
                    <p className="mt-1 text-sm text-slate-600">Transporter: {request.transporter?.fullName || "Not assigned yet"}</p>
                    <p className="mt-1 text-sm text-slate-600">Transporter email: {request.transporter?.email || "Not assigned yet"}</p>
                    <p className="mt-1 text-sm text-slate-600">Transporter phone: {request.transporter?.phoneNumber || "Not assigned yet"}</p>
                    <p className="mt-1 text-sm text-slate-600">Vehicle: {request.vehicle?.plateNumber || "Not assigned yet"}</p>
                    {request.notes && <p className="mt-2 text-sm text-slate-600">Notes: {request.notes}</p>}
                  </div>
                  <StatusBadge status={request.status} />
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Transport Timeline</p>
                  {(transportHistoryByRequest[request.id] || []).length === 0 ? (
                    <p className="text-sm text-slate-500">No transport status history recorded yet.</p>
                  ) : (
                    (transportHistoryByRequest[request.id] || [])
                      .slice()
                      .sort((left, right) => new Date(right.changedAt || 0) - new Date(left.changedAt || 0))
                      .map((item) => (
                        <div key={item.id} className="rounded-xl bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-500">{item.oldStatus || "Created"}</span>
                              <span className="text-slate-300">to</span>
                              <StatusBadge status={item.newStatus} />
                            </div>
                            <span className="text-sm text-slate-500">{formatDate(item.changedAt)}</span>
                          </div>
                          {item.comment && <p className="mt-3 text-sm text-slate-600">{item.comment}</p>}
                        </div>
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
