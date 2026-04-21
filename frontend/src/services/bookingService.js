import api from "../api/axios";

export const createBooking = async (payload) => {
  const { data } = await api.post("/api/bookings", payload);
  return data;
};

export const getBookings = async () => {
  const { data } = await api.get("/api/bookings");
  return data;
};