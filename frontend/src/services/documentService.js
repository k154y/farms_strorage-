import api from "../api/axios";
import { getUser } from "../utilis/auth";

export const getMyDocuments = async () => {
  const user = getUser();
  const { data } = await api.get("/api/documents/my", {
    params: { userId: user?.id },
  });
  return data;
};

export const uploadDocument = async ({ file, type }) => {
  const user = getUser();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("userId", user?.id ?? "");

  const { data } = await api.post("/api/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getAllDocuments = async () => {
  const { data } = await api.get("/api/documents");
  return data;
};

export const reviewDocument = async (docId, status, comment = "") => {
  const { data } = await api.patch(`/api/documents/${docId}/review`, null, {
    params: { status, comment },
  });
  return data;
};
