import { useState } from "react";
import { FiX, FiFlag, FiTag, FiUser, FiCalendar, FiTrash2, FiEdit, FiSave } from "react-icons/fi";

const TaskDetailModal = ({ task, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    labels: task.labels || [],
  });

  const priorityColors = {
    low: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
  };

  const labelColors = {
    Feature: "bg-blue-100 text-blue-700",
    Enhancement: "bg-purple-100 text-purple-700",
    Bug: "bg-red-100 text-red-700",
    Documentation: "bg-cyan-100 text-cyan-700",
    Design: "bg-pink-100 text-pink-700",
  };

  const allLabels = ['Bug', 'Feature', 'Enhancement', 'Documentation', 'Design'];

  const formatDate = (date) => {
    if (!date) return "No due date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSave = async () => {
    try {
      await onUpdate(task._id, editedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleLabelToggle = (label) => {
    setEditedTask(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="text-2xl font-bold text-gray-900 mb-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
              )}
              <p className="text-sm text-gray-500">Created {formatDate(task.createdAt)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {task.description || "No description provided"}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiFlag className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Priority</h3>
            </div>
            <div className="flex gap-2">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => isEditing && setEditedTask({ ...editedTask, priority })}
                  disabled={!isEditing}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                    (isEditing ? editedTask.priority : task.priority) === priority
                      ? priorityColors[priority]
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  } ${isEditing ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiTag className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Labels</h3>
            </div>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {allLabels.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleLabelToggle(label)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                      editedTask.labels.includes(label)
                        ? labelColors[label]
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {task.labels && task.labels.length > 0 ? (
                  task.labels.map((label) => (
                    <span
                      key={label}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        labelColors[label] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No labels</p>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiUser className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Assignee</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                {task.assignee ? task.assignee.name?.charAt(0).toUpperCase() : 'S'}
              </div>
              <p className="text-gray-600">
                {task.assignee ? task.assignee.name : "Sarah Chen"}
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiCalendar className="text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-700">Due Date</h3>
            </div>
            {isEditing ? (
              <input
                type="date"
                value={editedTask.dueDate}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-600">{formatDate(task.dueDate)}</p>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => onDelete(task._id)}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition"
          >
            <FiTrash2 />
            Delete Card
          </button>
          <div className="flex gap-3">
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition"
            >
              {isEditing ? <FiSave /> : <FiEdit />}
              {isEditing ? 'Save Changes' : 'Edit Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
