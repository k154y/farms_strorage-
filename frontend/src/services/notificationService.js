import api from "../api/axios";

export const getMyNotifications = async (userId) => (await api.get("/api/notifications/my", { params: { userId } })).data;
export const markNotificationRead = async (id) => (await api.put(`/api/notifications/${id}/read`)).data;
export const deleteNotification = async (id) => (await api.delete(`/api/notifications/${id}`)).data;

export const getUnreadNotificationsCount = async (userId) => {
  const items = await getMyNotifications(userId);
  return (items || []).filter((item) => !item.read).length;
};

export const emitNotificationsUpdated = () => {
  window.dispatchEvent(new Event("notifications-updated"));
};
