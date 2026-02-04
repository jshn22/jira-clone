import { memo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard.jsx";

const TaskColumn = memo(({ title, status, tasks, onAddTask, onTaskClick }) => {
  const statusColors = {
    todo: "bg-blue-50 border-blue-200",
    inprogress: "bg-yellow-50 border-yellow-200",
    done: "bg-green-50 border-green-200",
  };

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-w-[320px] rounded-xl bg-gray-50 p-4 ${
            snapshot.isDraggingOver ? "bg-blue-50 ring-2 ring-blue-300" : ""
          } transition-all`}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h2 className="font-bold text-sm text-gray-700">{title}</h2>
            <button
              onClick={() => onAddTask && onAddTask(status)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition"
            >
              <span className="text-lg">+</span>
            </button>
          </div>
          <div className="space-y-3 min-h-[200px]">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <p>No tasks</p>
                <p className="text-xs mt-1">Drag tasks here</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable
                  key={String(task._id)}
                  draggableId={String(task._id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${
                        snapshot.isDragging
                          ? "opacity-50 rotate-2 shadow-lg"
                          : ""
                      } transition-all`}
                    >
                      <TaskCard task={task} onClick={onTaskClick} />
                    </div>
                  )}
                </Draggable>
              ))
            )}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

TaskColumn.displayName = "TaskColumn";

export default TaskColumn;