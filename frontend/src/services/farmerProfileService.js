import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const getFarmerProfile = async () => {
  const user = getUser();
  return (await api.get("/api/farmer/profile", { params: { userId: user?.id } })).data;
};

export const updateFarmerAccount = async (payload) => {
  const user = getUser();
  return (await api.put("/api/farmer/profile/account", { ...payload, userId: user?.id })).data;
};

export const addFarmLocation = async (payload, overrideUserId) => {
  const user = getUser();
  return (await api.post("/api/farmer/profile/locations", payload, { params: { userId: overrideUserId ?? user?.id } })).data;
};

export const deleteFarmLocation = async (locationId) => {
  const user = getUser();
  return (await api.delete(`/api/farmer/profile/locations/${locationId}`, { params: { userId: user?.id } })).data;
};
