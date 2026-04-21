import { useParams } from "react-router-dom";

export default function FacilityDetailPage() {
  const { id } = useParams();
  return <div className="rounded-2xl bg-white p-6 shadow-sm">Facility detail page #{id}</div>;
}