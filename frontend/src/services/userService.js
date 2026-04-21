import api from "../api/axios";

export const getUsers = async () => (await api.get("/api/users")).data;
export const getPendingApprovals = async () => (await api.get("/api/users?status=PENDING_APPROVAL")).data;
export const getAuditLogs = async () => (await api.get("/api/audit-logs")).data;