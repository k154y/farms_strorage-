import api from "../api/axios";

export const loginUser = async (payload) => {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

export const registerFarmer = async (payload) => {
  const { data } = await api.post("/api/auth/register/farmer", payload);
  return data;
};

export const registerStorageManager = async (payload) => {
  const { data } = await api.post("/api/auth/register/storage-manager", payload);
  return data;
};

export const registerTransporter = async (payload) => {
  const { data } = await api.post("/api/auth/register/transporter", payload);
  return data;
};
