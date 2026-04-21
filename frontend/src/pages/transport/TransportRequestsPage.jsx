import { useEffect, useState } from "react";
import TransportTable from "../../components/tables/TransportTable";
import { getTransportRequests } from "../../services/transportService";

export default function TransportRequestsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getTransportRequests().then((res) => setItems(res.data || res)).catch(console.error);
  }, []);

  return <TransportTable items={items} />;
}