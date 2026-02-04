import { useState } from "react";
import { FiX, FiZap, FiLoader } from "react-icons/fi";
import axios from "axios";
import { useTask } from "../../context/TaskContext.jsx";

const TaskGeneratorModal = ({ projectId, onClose, onTasksGenerated }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [taskCount, setTaskCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const { addTask } = useTask();

  const handleGenerate = async () => {
    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("🤖 Generating tasks with:", { projectName, description, count: taskCount });

      const response = await axios.post(
        "http://localhost:5000/api/ai/generate-tasks",
        {
          projectName: projectName.trim(),
          description: description.trim(),
          count: taskCount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ AI Response:", response.data);
      setGeneratedTasks(response.data);
    } catch (err) {
      console.error("❌ AI Error:", err);
      setError(err.response?.data?.message || "Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTasks = async () => {
    setLoading(true);
    try {
      for (const task of generatedTasks) {
        await addTask(
          projectId,
          task.title,
          task.description,
          task.priority,
          null,
          task.labels || []
        );
      }
      onTasksGenerated();
      onClose();
    } catch (err) {
      setError("Failed to add some tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <FiZap className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Task Generator</h2>
                <p className="text-sm text-gray-600">Generate tasks using AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., E-commerce Website"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading || generatedTasks.length > 0}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={loading || generatedTasks.length > 0}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Tasks: {taskCount}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={taskCount}
              onChange={(e) => setTaskCount(Number(e.target.value))}
              className="w-full"
              disabled={loading || generatedTasks.length > 0}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          {generatedTasks.length === 0 ? (
            <button
              onClick={handleGenerate}
              disabled={loading || !projectName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiZap />
                  Generate Tasks
                </>
              )}
            </button>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Generated Tasks ({generatedTasks.length})</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                  {generatedTasks.map((task, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                        {task.labels?.map((label, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGeneratedTasks([]);
                    setProjectName("");
                    setDescription("");
                    setError("");
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-gray-700"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleAddTasks}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add All Tasks"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskGeneratorModal;
