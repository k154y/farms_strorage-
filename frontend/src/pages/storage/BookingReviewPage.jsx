import { useParams } from "react-router-dom";

export default function BookingReviewPage() {
  const { id } = useParams();
  return <div className="rounded-2xl bg-white p-6 shadow-sm">Review booking #{id}</div>;
}