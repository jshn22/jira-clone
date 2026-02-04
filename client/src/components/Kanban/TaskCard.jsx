import { useState, useRef, useEffect, memo } from "react";
import { useTask } from "../../context/TaskContext.jsx";
import { FiMoreVertical, FiCalendar, FiUser } from "react-icons/fi";

const TaskCard = memo(({ task, onClick }) => {
  const { removeTask } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priorityColors = {
    low: "bg-green-100 text-green-700 border-green-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    high: "bg-orange-100 text-orange-700 border-orange-300",
  };

  const labelColors = {
    Feature: "bg-blue-100 text-blue-700",
    Enhancement: "bg-purple-100 text-purple-700",
    Bug: "bg-red-100 text-red-700",
    Documentation: "bg-cyan-100 text-cyan-700",
    Design: "bg-pink-100 text-pink-700",
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this task?")) {
      try {
        await removeTask(task._id);
        setShowMenu(false); 
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleCardClick = (e) => {
    if (isDragging || e.target.closest("button")) {
      return;
    }
    onClick && onClick(task);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseDown={() => setIsDragging(false)}
      onMouseMove={() => setIsDragging(true)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm flex-1 pr-2 leading-tight">
          {task.title}
        </h3>
        <button
          onMouseDown={handleMenuClick}
          onClick={handleMenuClick}
          className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1"
          draggable={false}
        >
          <FiMoreVertical size={16} />
        </button>
      </div>
      {task.description && (
        <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.labels.map((label) => (
            <span
              key={label}
              className={`text-xs px-2 py-1 rounded font-medium ${
                labelColors[label] || "bg-gray-100 text-gray-700"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span
          className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
            priorityColors[task.priority] || "bg-gray-100 text-gray-700 border-gray-300"
          }`}
        >
          {task.priority}
        </span>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <FiCalendar size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center gap-1">
              <FiUser size={12} />
              <span>{task.assignee.name?.split(" ")[0]}</span>
            </div>
          )}
        </div>
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-2 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition whitespace-nowrap"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
