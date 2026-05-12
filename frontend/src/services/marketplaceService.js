import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const getListings = async () => {
  const { data } = await api.get("/api/marketplace/listings");
  return data;
};

export const getListingById = async (id) => {
  const { data } = await api.get(`/api/marketplace/listings/${id}`);
  return data;
};

export const createListing = async (payload) => {
  const { data } = await api.post("/api/marketplace/listings", payload);
  return data;
};

export const deleteListing = async (listingId) => {
  const { data } = await api.delete(`/api/marketplace/listings/${listingId}`);
  return data;
};

export const updateListing = async (listingId, payload) => {
  const { data } = await api.put(`/api/marketplace/listings/${listingId}`, payload);
  return data;
};

export const uploadListingImage = async ({ listingId, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/api/marketplace/listings/${listingId}/images/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getListingImages = async (listingId) => {
  const { data } = await api.get(`/api/marketplace/listings/${listingId}/images`);
  return data;
};

export const getMyListings = async () => {
  const user = getUser();
  const { data } = await api.get(`/api/marketplace/listings/farmer/${user?.id}`);
  return data;
};

export const getOrdersReceived = async () => {
  const user = getUser();
  const { data } = await api.get(`/api/marketplace/orders/farmer/${user?.id}`);
  return data;
};

export const createOrderRequest = async (payload) => {
  const { data } = await api.post("/api/marketplace/orders", payload);
  return data;
};
