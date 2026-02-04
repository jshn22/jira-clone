const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const { projectId } = req.params;

    if (!title) return res.status(400).json({ message: "Task title is required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({
      title,
      description,
      project: projectId,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).populate("assignee", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true }).populate("assignee", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body;

    const task = await Task.findByIdAndUpdate(taskId, { assignee: assigneeId }, { new: true }).populate("assignee", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign task" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!["todo", "inprogress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findByIdAndUpdate(
      taskId, 
      { status }, 
      { new: true }
    ).populate("assignee", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update task status" });
  }
};
