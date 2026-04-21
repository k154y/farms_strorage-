import { useEffect, useState } from "react";
import ColdRoomCard from "../../components/storage/ColdRoomCard";
import { getColdRooms } from "../../services/facilityService";

export default function ColdRoomsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getColdRooms().then((res) => setItems(res.data || res)).catch(console.error);
  }, []);

  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((r) => <ColdRoomCard key={r.id} room={r} />)}</div>;
}