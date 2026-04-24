import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const createBooking = async (payload) => {
  const { data } = await api.post("/api/bookings", payload);
  return data;
};

export const getBookings = async () => {
  const { data } = await api.get("/api/bookings");
  return data;
};

export const getMyBookings = async () => {
  const user = getUser();
  const data = await getBookings();
  const items = Array.isArray(data) ? data : data?.data || [];

  if (!user?.id) return items;

  return items.filter((booking) => booking.farmer?.id === user.id);
};
