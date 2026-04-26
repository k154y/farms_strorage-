import { useEffect, useState } from "react";
import ProductCard from "../../components/marketplace/ProductCard";
import { getMyListings } from "../../services/marketplaceService";

export default function MyListingsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getMyListings().then((res) => setItems(res.data || res)).catch(console.error);
  }, []);

  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>;
}
