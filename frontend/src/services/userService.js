import api from "../api/axios";

export const getUsers = async (params = {}) => (await api.get("/api/users", { params })).data;
export const getPendingApprovals = async () => (await api.get("/api/users", { params: { status: "PENDING_APPROVAL" } })).data;
export const updateUserStatus = async (id, status) => (await api.patch(`/api/users/${id}/status`, status, {
  headers: { "Content-Type": "application/json" },
})).data;
export const getAuditLogs = async () => (await api.get("/api/audit-logs")).data;
