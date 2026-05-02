import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const getStorageManagerProfile = async () => {
  const user = getUser();
  return (await api.get("/api/manager/profile", { params: { userId: user?.id } })).data;
};

export const updateStorageManagerProfile = async (payload) => {
  const user = getUser();
  return (await api.put("/api/manager/profile/account", { ...payload, userId: user?.id })).data;
};
