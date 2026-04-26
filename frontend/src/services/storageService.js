import api from "../api/axios";

export const getFacilities = async () => {
  const { data } = await api.get("/api/storage/facilities");
  return data;
};

export const getColdRooms = async () => {
  const { data } = await api.get("/api/storage/cold-rooms");
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get("/api/storage/categories");
  return data?.data || [];
};
