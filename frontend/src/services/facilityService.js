import api from "../api/axios";

export const getFacilities = async () => (await api.get("/api/storage/facilities")).data;
export const getFacilityById = async (id) => (await api.get(`/api/storage/facilities/${id}`)).data;
export const createFacility = async (payload) => (await api.post("/api/storage/facilities", payload)).data;
export const getColdRooms = async () => (await api.get("/api/storage/cold-rooms")).data;