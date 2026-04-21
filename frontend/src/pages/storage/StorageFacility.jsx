import { useEffect, useState } from "react";
import FacilityCard from "../../components/storage/FacilityCard";
import { getFacilities } from "../../services/facilityService";

export default function FacilitiesPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getFacilities().then((res) => setItems(res.data || res)).catch(console.error);
  }, []);

  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((f) => <FacilityCard key={f.id} facility={f} />)}</div>;
}