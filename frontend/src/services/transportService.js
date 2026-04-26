import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const getVehicles = async () => {
  const { data } = await api.get("/api/transport/vehicles");
  return data;
};

export const getMyVehicles = async () => {
  const user = getUser();

  if (!user?.id) return [];

  const { data } = await api.get(`/api/transport/vehicles/transporter/${user.id}`);
  return data;
};

export const createVehicle = async (payload) => {
  const { data } = await api.post("/api/transport/vehicles", payload);
  return data;
};

export const getTransportRequests = async () => {
  const { data } = await api.get("/api/transport/requests");
  return data;
};

export const getMyAssignedTransportRequests = async () => {
  const user = getUser();

  if (!user?.id) return [];

  const { data } = await api.get(`/api/transport/requests/transporter/${user.id}`);
  return data;
};

export const getAvailableTransportRequests = async () => {
  const user = getUser();

  if (!user?.id) return [];

  const { data } = await api.get(`/api/transport/requests/available/transporter/${user.id}`);
  return data;
};

export const acceptTransportRequest = async ({ requestId, vehicleId, comment = "" }) => {
  const user = getUser();

  const { data } = await api.patch(`/api/transport/requests/${requestId}/assign`, {
    transporterId: user?.id,
    vehicleId,
    changedByUserId: user?.id,
    comment,
  });

  return data;
};

export const createTransportRequest = async (payload) => {
  const { data } = await api.post("/api/transport/requests", payload);
  return data;
};

export const getMyTransportRequests = async () => {
  const user = getUser();

  if (!user?.id) return [];

  const { data } = await api.get(`/api/transport/requests/farmer/${user.id}`);
  return data;
};

export const getTransportRequestsByBookingId = async (bookingId) => {
  const { data } = await api.get(`/api/transport/requests/booking/${bookingId}`);
  return data;
};

export const getTransportRequestById = async (transportRequestId) => {
  const { data } = await api.get(`/api/transport/requests/${transportRequestId}`);
  return data;
};

export const getTransportHistory = async (transportRequestId) => {
  const { data } = await api.get(`/api/transport/requests/${transportRequestId}/history`);
  return data;
};

export const updateTransportRequestStatus = async (transportRequestId, payload) => {
  const { data } = await api.patch(`/api/transport/requests/${transportRequestId}/status`, payload);
  return data;
};
