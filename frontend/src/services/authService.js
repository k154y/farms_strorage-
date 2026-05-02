import api from "../api/axios";

export const loginUser = async (payload) => {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

export const loginWithGoogleUser = async (idToken) => {
  const { data } = await api.post("/api/auth/google", { idToken });
  return data;
};

export const registerWithGoogleUser = async (payload) => {
  const { data } = await api.post("/api/auth/register/google", payload);
  return data;
};

export const verifyEmailToken = async (token) => {
  const { data } = await api.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/api/auth/forgot-password", { email });
  return data;
};

export const resendVerificationEmail = async (email) => {
  const { data } = await api.post("/api/auth/resend-verification", { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post("/api/auth/reset-password", payload);
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
