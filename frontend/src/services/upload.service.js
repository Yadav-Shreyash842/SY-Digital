import { apiClient } from "./apiClient";

export const uploadService = {
  uploadImage: async (file, onProgress) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await apiClient.post("/api/upload/image", fd, {
      onUploadProgress: (e) => {
        if (e.total) {
          const percent = Math.round((e.loaded * 100) / e.total);
          onProgress?.(percent);
        }
      },
    });

    return res.data;
  },

  uploadVideo: async (file, onProgress) => {
    const fd = new FormData();
    fd.append("video", file);
    const res = await apiClient.post("/api/upload/video", fd, {
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