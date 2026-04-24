import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const getVehicles = async () => {
  const { data } = await api.get("/api/transport/vehicles");
  return data;
};

export const getTransportRequests = async () => {
  const { data } = await api.get("/api/transport/requests");
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
