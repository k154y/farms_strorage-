import { useParams } from "react-router-dom";

export default function BookingDetailPage() {
  const { id } = useParams();
  return <div className="rounded-2xl bg-white p-6 shadow-sm">Booking details for #{id}</div>;
}