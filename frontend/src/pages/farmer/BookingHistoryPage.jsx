import { useEffect, useState } from "react";
import BookingTable from "../../components/tables/BookingTable";
import { getMyBookings, updateBookingStatus } from "../../services/bookingService";
import { getUser } from "../../utilis/auth";

export default function BookingHistoryPage() {
  const user = getUser();
  const [items, setItems] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMyBookings()
      .then(setItems)
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load bookings");
      });
  }, []);

  const handleCancel = async (item) => {
    const confirmed = window.confirm(
      `Cancel booking #${item.id}? Linked transport requests that have not started yet will also be cancelled.`
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(item.id);
    setError("");
    setMessage("");

    try {
      const updated = await updateBookingStatus(item.id, {
        status: "CANCELLED",
        changedByUserId: user?.id,
        comment: "Cancelled by farmer from booking list.",
      });

      setItems((current) =>
        current.map((booking) => (booking.id === item.id ? updated : booking))
      );
      setMessage(`Booking #${item.id} cancelled successfully.`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {message ? <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
      {error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      <BookingTable items={items} onCancel={handleCancel} cancellingId={cancellingId} />
    </div>
  );
}
