import api from "../api/axios";

export const getFacilities = async () => (await api.get("/api/storage/facilities")).data;
export const getFacilityById = async (id) => (await api.get(`/api/storage/facilities/${id}`)).data;
export const createFacility = async (payload) => (await api.post("/api/storage/facilities", payload)).data;
export const getColdRooms = async () => (await api.get("/api/storage/cold-rooms")).data;
export const getProduceCategories = async () => (await api.get("/api/storage/categories")).data;
export const createColdRoom = async (payload) => (await api.post("/api/storage/cold-rooms", payload)).data;

export const uploadFacilityPhoto = async ({ facilityId, file }) => {
  const formData = new FormData();
  formData.append("facilityId", facilityId);
  formData.append("file", file);

  return (
    await api.post("/api/storage/facility-photos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
};

export const getFacilityPhotos = async (facilityId) =>
  (await api.get(`/api/storage/facility-photos/facility/${facilityId}`)).data;
