import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import { FiFolder, FiX } from "react-icons/fi";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { projects, loading, addProject } = useProject();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ec4899");

  const projectColors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Green", value: "#10b981" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Red", value: "#ef4444" },
    { name: "Indigo", value: "#6366f1" },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token && !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      await addProject(form.name, form.description);
      setForm({ name: "", description: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading projects...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-lg text-sm font-bold mb-3 inline-block"
            >
              ← Dashboard
            </button>
            <h1 className="section-header">📁 Projects</h1>
            <p className="text-gray-600 text-sm">Welcome back, <span className="font-semibold">{user?.name}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-danger"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mb-6 flex items-center gap-2"
          >
            <span className="text-lg">+</span> New Project
          </button>
        )}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <FiFolder className="text-white text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                    setForm({ name: "", description: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>
              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                      name="name"
                      placeholder="e.g., Website Redesign"
                      value={form.name}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      name="description"
                      placeholder="Brief description of the project"
                      rows="3"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }}></span>
                      Project Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {projectColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color.value)}
                          className={`h-12 rounded-lg transition-all ${
                            selectedColor === color.value
                              ? "ring-4 ring-offset-2 scale-105"
                              : "hover:scale-105"
                          }`}
                          style={{ 
                            backgroundColor: color.value,
                            ringColor: color.value
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setError("");
                        setForm({ name: "", description: "" });
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition"
                      style={{ backgroundColor: selectedColor }}
                    >
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg mb-2">📭 No projects yet</p>
            <p className="text-gray-400 text-sm">Create your first project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/kanban/${project._id}`)}
                className="card p-6 cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 border-l-4 border-blue-500"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description || "No description provided"}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <span>👤 {project.members?.length || 0} members</span>
                  <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
