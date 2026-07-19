import { apiClient } from "./apiClient";

export const uploadService = {
  uploadImage: async (formData) => {
    const res = await apiClient.post("/api/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  uploadVideo: async (formData) => {
    const res = await apiClient.post("/api/upload/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};

export default uploadService;