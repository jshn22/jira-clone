import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const projectService = {
  createProject: async (name, description) => {
    try {
      const res = await axios.post(
        `${API}/projects`,
        { name, description },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to create project");
    }
  },

  getProjects: async () => {
    try {
      const res = await axios.get(`${API}/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch projects");
    }
  },

  getProjectById: async (id) => {
    try {
      const res = await axios.get(`${API}/projects/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch project");
    }
  },

  updateProject: async (id, updates) => {
    try {
      const res = await axios.put(`${API}/projects/${id}`, updates, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update project");
    }
  },

  deleteProject: async (id) => {
    try {
      const res = await axios.delete(`${API}/projects/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete project");
    }
  },

  addMember: async (projectId, memberId) => {
    try {
      const res = await axios.post(
        `${API}/projects/${projectId}/members`,
        { memberId },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add member");
    }
  },

  getAllProjects: async () => {
    try {
      const response = await axios.get(`${API}/projects`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch projects");
    }
  },
};

export default projectService;
