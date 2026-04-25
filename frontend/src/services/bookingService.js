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

export const getBookingsByManager = async (managerId) => {
  const { data } = await api.get("/api/bookings", { params: { managerId } });
  return data;
};

export const updateBookingStatus = async (bookingId, payload) => {
  const { data } = await api.patch(`/api/bookings/${bookingId}/status`, payload);
  return data;
};

export const getBookingById = async (bookingId) => {
  const { data } = await api.get(`/api/bookings/${bookingId}`);
  return data;
};

export const getBookingHistory = async (bookingId) => {
  const { data } = await api.get(`/api/bookings/${bookingId}/history`);
  return data;
};

export const getMyBookings = async () => {
  const user = getUser();
  const data = await api.get("/api/bookings", { params: { farmerId: user?.id } });
  const items = Array.isArray(data.data) ? data.data : data?.data?.data || [];

  if (!user?.id) return items;

  return items.filter((booking) => booking.farmer?.id === user.id);
};
