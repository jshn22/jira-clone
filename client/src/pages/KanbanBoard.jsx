import { useEffect, useState, useMemo} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useTask } from "../context/TaskContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useProject } from "../context/ProjectContext.jsx";
import projectService from "../services/projectService.jsx";
import TaskColumn from "../components/Kanban/TaskColumn.jsx";
import TaskGeneratorModal from "../components/AI/TaskGeneratorModal.jsx";
import TaskDetailModal from "../components/Kanban/TaskDetailModal.jsx";
import { 
  FiGrid,
  FiLayers,
  FiZap,
  FiLogOut,
  FiSearch,
  FiPlus,
  FiBarChart2,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiClock,
  FiUsers,
  FiFolder,
  FiX
} from "react-icons/fi";

const KanbanBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projects, addProject, fetchProjects } = useProject();
  const { tasks, fetchTasks, addTask, updateTask, updateTaskStatus, loading, removeTask } = useTask();
  const [project, setProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    priority: "medium", 
    dueDate: "",
    assignee: "",
    labels: []
  });
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todo");
  const [showStats, setShowStats] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [selectedColor, setSelectedColor] = useState("#ec4899");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

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
    if (projects.length === 0) {
      fetchProjects();
    }
  }, []); 

  const todoTasks = useMemo(() => tasks.filter((t) => t.status === "todo"), [tasks]);
  const inprogressTasks = useMemo(() => tasks.filter((t) => t.status === "inprogress"), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "done"), [tasks]);

  const statistics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = doneTasks.length;
    const urgentTasks = tasks.filter((t) => t.priority === "urgent").length;
    const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
    const overdueTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date() && t.status !== "done";
    }).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, urgentTasks, highPriorityTasks, overdueTasks, completionRate };
  }, [tasks, doneTasks]);

  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoad && !projectId) return; 
      
      try {
        const proj = await projectService.getProjectById(projectId);
        setProject(proj);
        await fetchTasks(projectId);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      await addTask(
        projectId, 
        form.title, 
        form.description, 
        form.priority, 
        form.dueDate,
        selectedLabels 
      );
      setForm({ title: "", description: "", priority: "medium", dueDate: "", assignee: "", labels: [] });
      setSelectedLabels([]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    try {
      await updateTaskStatus(draggableId, destination.droppableId);
    } catch (err) {
      console.error("Drag error:", err);
      setError(err.message);
    }
  };

  const handleTasksGenerated = async () => {
    await fetchTasks(projectId);
  };

  const handleAddTaskToColumn = (status) => {
    setSelectedStatus(status);
    setShowForm(true);
  };

  const handleLabelToggle = (label) => {
    setSelectedLabels(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!projectForm.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      console.log("Creating project:", projectForm.name);
      await addProject(projectForm.name, projectForm.description);
      setProjectForm({ name: "", description: "" });
      setSelectedColor("#ec4899");
      setShowProjectForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };

  const handleDeleteFromModal = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      try {
        await removeTask(taskId);
        setSelectedTask(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      setSelectedTask(updatedTask); 
      await fetchTasks(projectId); 
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message);
    }
  };

  const { totalTasks, completedTasks, urgentTasks, highPriorityTasks, overdueTasks, completionRate } = statistics;

  if (isInitialLoad || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading board...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
            >
              <FiGrid className="text-lg" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white">
              <FiLayers className="text-lg" />
              <span className="font-medium">Board View</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
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
              {projects.slice(0, 3).map((proj) => (
                <button
                  key={proj._id}
                  onClick={() => navigate(`/kanban/${proj._id}`)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition text-left ${
                    proj._id === projectId ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${proj._id === projectId ? "bg-blue-500" : "bg-pink-500"}`}></div>
                  <span className="text-sm truncate">{proj.name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition">
            <FiLogOut className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project?.name || "Project Board"}</h1>
              <p className="text-sm text-gray-600 mt-1">{project?.name} Board</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 transition ${
                  showStats 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <FiBarChart2 />
                <span>Stats</span>
              </button>
              <button
                onClick={() => setShowAIGenerator(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
              >
                <FiZap />
                <span>AI Assistant</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </header>

        <div className="p-6">
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 animate-fadeIn">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Total Tasks</span>
                  <FiTrendingUp className="text-blue-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-blue-900">{totalTasks}</p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Completed</span>
                  <FiCheckCircle className="text-green-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-green-900">{completedTasks}</p>
                <p className="text-xs text-green-600 mt-1">{completionRate}% done</p>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-700">Urgent</span>
                  <FiAlertTriangle className="text-red-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-red-900">{urgentTasks}</p>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-700">High Priority</span>
                  <FiAlertCircle className="text-orange-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-orange-900">{highPriorityTasks}</p>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">Overdue</span>
                  <FiClock className="text-purple-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-purple-900">{overdueTasks}</p>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-700">Team Members</span>
                  <FiUsers className="text-indigo-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-indigo-900">{project?.members?.length || 1}</p>
              </div>
            </div>
          )}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              <TaskColumn 
                title={`Planning (${todoTasks.length})`} 
                status="todo" 
                tasks={todoTasks}
                onAddTask={handleAddTaskToColumn}
                onTaskClick={handleTaskClick}
              />
              <TaskColumn 
                title={`In Progress (${inprogressTasks.length})`} 
                status="inprogress" 
                tasks={inprogressTasks}
                onAddTask={handleAddTaskToColumn}
                onTaskClick={handleTaskClick}
              />
              <TaskColumn 
                title={`Done (${doneTasks.length})`} 
                status="done" 
                tasks={doneTasks}
                onAddTask={handleAddTaskToColumn}
                onTaskClick={handleTaskClick}
              />
              
              <div className="min-w-[300px] border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition cursor-not-allowed opacity-60">
                <FiPlus className="text-2xl text-gray-400 mb-2" />
                <span className="text-gray-600 font-medium text-sm">Add List</span>
                <span className="text-gray-400 text-xs mt-1">(Coming Soon)</span>
              </div>
            </div>
          </DragDropContext>
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Create New Card</h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setError("");
                      setSelectedLabels([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      type="text"
                      name="title"
                      placeholder="Enter card title"
                      value={form.title}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <div className="relative">
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
                        name="description"
                        placeholder="Enter card description"
                        rows="4"
                        value={form.description}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAIGenerator(true)}
                        className="absolute top-3 right-3 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-md flex items-center gap-1"
                      >
                        <FiZap className="text-sm" />
                        AI Generate
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Tip: Add a title first, then use AI Generate for suggestions</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Priority</label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setForm({ ...form, priority })}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                            form.priority === priority
                              ? priority === 'low' ? 'bg-green-500 text-white' :
                                priority === 'medium' ? 'bg-blue-500 text-white' :
                                'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Labels</label>
                    <div className="flex flex-wrap gap-2">
                      {['Bug', 'Feature', 'Enhancement', 'Documentation', 'Design'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleLabelToggle(label)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                            selectedLabels.includes(label)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee</label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      type="text"
                      name="assignee"
                      placeholder="Enter assignee name"
                      value={form.assignee}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setError("");
                        setSelectedLabels([]);
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
                    >
                      Create Card
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
                      setError("");
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
                        name="name"
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
                        name="description"
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
                          setError("");
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
          {selectedTask && (
            <TaskDetailModal
              task={selectedTask}
              onClose={handleCloseTaskDetail}
              onDelete={handleDeleteFromModal}
              onUpdate={handleUpdateTask}
            />
          )}
        </div>
      </main>
      {showAIGenerator && (
        <TaskGeneratorModal
          projectId={projectId}
          onClose={() => setShowAIGenerator(false)}
          onTasksGenerated={handleTasksGenerated}
        />
      )}
    </div>
  );
};

export default KanbanBoard;