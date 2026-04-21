import { useParams } from "react-router-dom";

export default function TransportRequestDetailPage() {
  const { id } = useParams();
  return <div className="rounded-2xl bg-white p-6 shadow-sm">Transport request detail #{id}</div>;
}