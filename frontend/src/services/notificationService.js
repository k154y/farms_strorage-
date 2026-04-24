import api from "../api/axios";

export const getMyNotifications = async (userId) => (await api.get("/api/notifications/my", { params: { userId } })).data;
export const markNotificationRead = async (id) => (await api.put(`/api/notifications/${id}/read`)).data;
