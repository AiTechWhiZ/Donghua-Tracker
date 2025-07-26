import api from "./api";

export const getAllDonghua = async () => {
  const response = await api.get("/donghua");
  return response.data;
};

export const getDonghuaById = async (id) => {
  const response = await api.get(`/donghua/${id}`);
  return response.data;
};

export const addDonghua = async (donghuaData) => {
  const response = await api.post("/donghua", donghuaData);
  return response.data;
};

export const updateDonghua = async (id, donghuaData) => {
  const response = await api.put(`/donghua/${id}`, donghuaData);
  return response.data;
};

export const deleteDonghua = async (id) => {
  const response = await api.delete(`/donghua/${id}`);
  return response.data;
};

// Function to update next episode air date when an episode airs
export const updateNextEpisodeAirDate = async (id) => {
  const response = await api.post(`/donghua/${id}/update-next-episode`);
  return response.data;
};

// Function to check and update expired air dates
export const checkAndUpdateExpiredEpisodes = async () => {
  const response = await api.post("/donghua/check-expired-episodes");
  return response.data;
};

export const getDonghuaStats = async () => {
  try {
    const response = await api.get("/donghua/stats");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch stats");
  }
};

export const exportDonghuaData = async () => {
  try {
    const response = await api.get("/donghua/export");
    return response.data;
  } catch (error) {
    throw new Error("Failed to export data");
  }
};

export const importDonghuaData = async (data) => {
  try {
    const response = await api.post("/donghua/import", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to import data");
  }
};
