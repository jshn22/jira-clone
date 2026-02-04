import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const taskService = {
  createTask: async (projectId, title, description, priority, dueDate, labels) => {
    try {
      console.log("Creating task with:", { projectId, title, description, priority, dueDate, labels });
      const response = await axios.post(
        `${API_URL}/tasks`,
        {
          projectId,
          title,
          description,
          priority,
          dueDate,
          labels,
        },
        getAuthHeaders()
      );
      console.log("Task created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to create task");
    }
  },

  getTasksByProject: async (projectId) => {
    try {
      console.log("Fetching tasks for project:", projectId);
      const response = await axios.get(
        `${API_URL}/tasks/project/${projectId}`,
        getAuthHeaders()
      );
      console.log("Tasks API response:", response);
      console.log("Tasks data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Tasks fetch error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch tasks");
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}/status`,
        { status },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      console.log("Updating task:", taskId, updates);
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        updates,
        getAuthHeaders()
      );
      console.log("Task updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  },

  deleteTask: async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, getAuthHeaders());
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete task");
    }
  },
};

export default taskService;
