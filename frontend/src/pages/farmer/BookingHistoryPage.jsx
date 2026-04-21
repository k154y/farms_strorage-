import { useEffect, useState } from "react";
import BookingTable from "../../components/tables/BookingTable";
import { getBookings } from "../../services/bookingService";

export default function BookingHistoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getBookings().then((res) => setItems(res.data || res)).catch(console.error);
  }, []);

  return <BookingTable items={items} />;
}