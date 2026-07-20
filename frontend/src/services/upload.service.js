import { apiClient } from "./apiClient";

export const uploadService = {
  uploadImage: async (formData, onProgress) => {
    const res = await apiClient.post("/api/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (e) => {
        if (e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress?.(percent);
        }
      },
    });

    return res.data;
  },

  uploadVideo: async (formData, onProgress) => {
    const res = await apiClient.post("/api/upload/video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (e) => {
        if (e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress?.(percent);
        }
      },
    });

    return res.data;
  },
};

export default uploadService;