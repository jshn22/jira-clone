import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const aiService = {
  generateTasks: async (projectId, description) => {
    try {
      const res = await axios.post(
        `${API}/ai/generate-tasks`,
        { projectId, description },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to generate tasks");
    }
  },

  breakdownTask: async (taskId, title, description) => {
    try {
      const res = await axios.patch(
        `${API}/ai/${taskId}/breakdown`,
        { title, description },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to breakdown task");
    }
  },

  generateSprintPlan: async (projectId, teamSize) => {
    try {
      const res = await axios.post(
        `${API}/ai/${projectId}/sprint-plan`,
        { teamSize },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to generate sprint plan");
    }
  },

  getInsights: async (projectId) => {
    try {
      const res = await axios.get(`${API}/ai/${projectId}/insights`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to get insights");
    }
  },
};

export default aiService;
