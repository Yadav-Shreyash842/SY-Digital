import { apiClient } from "./apiClient";

export const projectService = {
  // Get all projects
  list: async (params = {}) => {
    const res = await apiClient.get("/api/projects", { params });
    return res.data;
  },

  // Get featured projects
  featured: async () => {
    const res = await apiClient.get("/api/projects/featured");
    return res.data;
  },

  // Get single project by slug
  getBySlug: async (slug) => {
    const res = await apiClient.get(`/api/projects/${slug}`);
    return res.data;
  },

  // Create project
  create: async (payload) => {
    const res = await apiClient.post("/api/projects", payload);
    return res.data;
  },

  // Update project
  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/projects/${id}`, payload);
    return res.data;
  },

  // Delete project
  remove: async (id) => {
    const res = await apiClient.delete(`/api/projects/${id}`);
    return res.data;
  },
};

export default projectService;