import api from "../api/axios";

export const getListings = async () => {
  const { data } = await api.get("/api/marketplace/listings");
  return data;
};

export const getListingById = async (id) => {
  const { data } = await api.get(`/api/marketplace/listings/${id}`);
  return data;
};

export const createOrderRequest = async (payload) => {
  const { data } = await api.post("/api/marketplace/orders", payload);
  return data;
};