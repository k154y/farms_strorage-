import api from "../api/axios";

export const getMyNotifications = async () => (await api.get("/api/notifications/my")).data;
export const markNotificationRead = async (id) => (await api.patch(`/api/notifications/${id}/read`)).data;