import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import taskService from "../services/taskService.jsx";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { 
  FiGrid,
  FiLayers,
  FiZap,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiLogOut,
  FiExternalLink,
  FiPlus,
  FiX
} from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projects, addProject, fetchProjects } = useProject();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    projects: 0,
  });
  const [taskDistribution, setTaskDistribution] = useState({ todo: 0, inprogress: 0, done: 0 });
  const [loading, setLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
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

  useEffect(() => {
    console.log("Dashboard: Fetching projects on mount");
    fetchProjects();
  }, []); 

  useEffect(() => {
    console.log("Dashboard mounted, projects:", projects);
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects]); 

  useEffect(() => {
    if (selectedProject?._id) {
      loadProjectStats(selectedProject._id);
    }
  }, [selectedProject?._id]); 

  const loadProjectStats = async (projectId) => {
    setLoading(true);
    try {
      const tasks = await taskService.getTasksByProject(projectId);
      
      const totalTasks = tasks.length;
      const completed = tasks.filter((t) => t.status === "done").length;
      const inProgress = tasks.filter((t) => t.status === "inprogress").length;
      const todo = tasks.filter((t) => t.status === "todo").length;

      setStats({
        totalTasks,
        completed,
        inProgress,
        projects: projects.length,
      });

      setTaskDistribution({ todo, inprogress: inProgress, done: completed });
    } catch (err) {
      console.error("Error loading project stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      console.log("Creating project:", projectForm.name);
      await addProject(projectForm.name, projectForm.description);
      setProjectForm({ name: "", description: "" });
      setSelectedColor("#ec4899");
      setShowProjectForm(false);
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project: " + err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completed / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <FiGrid className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
        </div>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Navigation</p>
          <div className="space-y-1">
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeNav === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <FiGrid className="text-lg" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveNav("board");
                if (selectedProject) navigate(`/kanban/${selectedProject._id}`);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeNav === "board"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <FiLayers className="text-lg" />
              <span className="font-medium">Board View</span>
            </button>
            <button
              onClick={() => setActiveNav("ai")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeNav === "ai"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <FiZap className="text-lg" />
              <span className="font-medium">AI Assistant</span>
            </button>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Projects</p>
              <button
                onClick={() => setShowProjectForm(true)}
                className="text-gray-400 hover:text-white"
              >
                <FiPlus className="text-sm" />
              </button>
            </div>
            <div className="space-y-1">
              {projects.slice(0, 3).map((project) => (
                <button
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition text-left ${
                    selectedProject?._id === project._id
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm truncate">{project.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition"
          >
            <FiLogOut className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>


      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiGrid className="text-blue-600" />
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your project overview</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          {projects.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
              <p className="text-yellow-700 text-sm font-medium">No projects found. Create a project first!</p>
              <button
                onClick={() => setShowProjectForm(true)}
                className="mt-2 text-yellow-700 hover:text-yellow-800 text-sm font-bold underline"
              >
                Create Project →
              </button>
            </div>
          ) : (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
              <div className="flex gap-2">
                <select
                  value={selectedProject?._id || ""}
                  onChange={(e) => {
                    const project = projects.find((p) => p._id === e.target.value);
                    setSelectedProject(project);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => selectedProject && navigate(`/kanban/${selectedProject._id}`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                  disabled={!selectedProject}
                >
                  <span>Open Board</span>
                  <FiExternalLink />
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <FiGrid className="text-3xl text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTasks}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <FiCheckCircle className="text-3xl text-green-500" />
              </div>
              <p className="text-sm text-green-700">Completed</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{stats.completed}</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center justify-between mb-3">
                <FiClock className="text-3xl text-yellow-500" />
              </div>
              <p className="text-sm text-yellow-700">In Progress</p>
              <p className="text-3xl font-bold text-yellow-700 mt-2">{stats.inProgress}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <FiFolder className="text-3xl text-purple-500" />
              </div>
              <p className="text-sm text-purple-700">Projects</p>
              <p className="text-3xl font-bold text-purple-700 mt-2">{stats.projects}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Task Distribution</h2>
              {stats.totalTasks === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <p className="text-center">No tasks yet</p>
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto">
                  <Pie
                    data={{
                      labels: ["To Do", "In Progress", "Done"],
                      datasets: [{
                        data: [taskDistribution.todo, taskDistribution.inprogress, taskDistribution.done],
                        backgroundColor: ["#93C5FD", "#FCD34D", "#34D399"],
                        borderWidth: 0,
                      }],
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      maintainAspectRatio: true,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Project Progress</h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Completion Rate</span>
                  <span className="text-2xl font-bold text-green-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Remaining</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{stats.totalTasks - stats.completed}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">All Projects</h2>
              <span className="text-sm text-gray-600">{projects.length} total</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/kanban/${project._id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{project.description || "No description"}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>👤 {project.members?.length || 0} members</span>
                    <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showProjectForm && (
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
                    setShowProjectForm(false);
                    setProjectForm({ name: "", description: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleProjectSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                      placeholder="e.g., Website Redesign"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Brief description of the project"
                      rows="3"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
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
                        setShowProjectForm(false);
                        setProjectForm({ name: "", description: "" });
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
      </main>
    </div>
  );
};

export default Dashboard;