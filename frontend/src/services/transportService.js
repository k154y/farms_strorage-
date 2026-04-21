import api from "../api/axios";

export const getVehicles = async () => {
  const { data } = await api.get("/api/transport/vehicles");
  return data;
};

export const getTransportRequests = async () => {
  const { data } = await api.get("/api/transport/requests");
  return data;
};