import React, { createContext, useContext, useState } from "react";
import taskService from "../services/taskService.jsx";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async (projectId) => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.getTasksByProject(projectId);
      console.log("Fetched tasks from MongoDB:", data);
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (projectId, title, description, priority, dueDate, labels) => {
    try {
      const newTask = await taskService.createTask(
        projectId,
        title,
        description,
        priority,
        dueDate,
        labels
      );
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const updated = await taskService.updateTaskStatus(taskId, status);
      setTasks(tasks.map((t) => String(t._id) === String(taskId) ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const assignTaskToUser = async (taskId, assigneeId) => {
    try {
      const updated = await taskService.assignTask(taskId, assigneeId);
      setTasks(tasks.map((t) => String(t._id) === String(taskId) ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => String(t._id) !== String(taskId)));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updated = await taskService.updateTask(taskId, updates);
      setTasks(tasks.map((t) => String(t._id) === String(taskId) ? updated : t));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const filterTasksByProject = (projectId) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        updateTaskStatus,
        assignTaskToUser,
        removeTask,
        filterTasksByProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);