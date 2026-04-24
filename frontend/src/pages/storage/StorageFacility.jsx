import { useEffect, useState } from "react";
import FacilityCard from "../../components/storage/FacilityCard";
import { getFacilities } from "../../services/facilityService";
import { getUser } from "../../utilis/auth";

export default function FacilitiesPage() {
  const [items, setItems] = useState([]);
  const user = getUser();

  useEffect(() => {
    getFacilities()
      .then((res) => {
        const facilities = res.data || res || [];
        setItems(facilities.filter((facility) => facility.manager?.id === user?.id));
      })
      .catch(console.error);
  }, [user?.id]);

  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((f) => <FacilityCard key={f.id} facility={f} />)}</div>;
}
