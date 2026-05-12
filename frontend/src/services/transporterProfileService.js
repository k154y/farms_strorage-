import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const getTransporterProfile = async () => {
  const user = getUser();
  return (await api.get("/api/transporter/profile", { params: { userId: user?.id } })).data;
};

export const updateTransporterProfile = async (payload) => {
  const user = getUser();
  return (await api.put("/api/transporter/profile/account", { ...payload, userId: user?.id })).data;
};
