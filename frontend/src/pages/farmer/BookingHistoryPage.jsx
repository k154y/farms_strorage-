import { useEffect, useState } from "react";
import BookingTable from "../../components/tables/BookingTable";
import { getMyBookings } from "../../services/bookingService";

export default function BookingHistoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getMyBookings().then(setItems).catch(console.error);
  }, []);

  return <BookingTable items={items} />;
}
