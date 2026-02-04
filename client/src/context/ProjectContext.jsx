import { createContext, useContext, useState, useEffect } from "react";
import projectService from "../services/projectService.jsx";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setProjects([]);
        return;
      }
      
      const data = await projectService.getAllProjects();
      console.log("Fetched projects from MongoDB:", data);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (name, description) => {
    try {
      const newProject = await projectService.createProject(name, description);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        fetchProjects,
        addProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};


export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider");
  }
  return context;
};