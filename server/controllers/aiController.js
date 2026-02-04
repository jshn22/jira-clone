const Task = require("../models/Task");
const Project = require("../models/Project");
const aiService = require("../services/aiService");

exports.generateTasks = async (req, res) => {
  try {
    const { projectId, description } = req.body;

    if (!projectId || !description) {
      return res.status(400).json({ message: "Project ID and description are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const generatedTasks = await aiService.generateTasksFromDescription(description);

    const savedTasks = await Task.insertMany(
      generatedTasks.map((task) => ({
        ...task,
        project: projectId,
        status: "todo",
      }))
    );

    res.status(201).json({
      message: "Tasks generated successfully",
      tasks: savedTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to generate tasks" });
  }
};

exports.breakdownTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtasks = await aiService.breakdownTaskIntoSubtasks(title, description);

    task.subtasks = subtasks;
    await task.save();

    res.json({
      message: "Task broken down into subtasks",
      task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to breakdown task" });
  }
};

exports.generateSprintPlan = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { teamSize } = req.body;

    if (!teamSize) {
      return res.status(400).json({ message: "Team size is required" });
    }

    const project = await Project.findById(projectId).populate("members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const sprintPlan = await aiService.generateSprintPlan(
      project.description || project.name,
      teamSize
    );

    res.json({
      message: "Sprint plan generated",
      plan: sprintPlan,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to generate sprint plan" });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const allTasks = await Task.countDocuments({ project: projectId });
    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: "done",
    });

    const insights = await aiService.generateInsights(allTasks, completedTasks);

    res.json({
      message: "Insights generated",
      data: {
        totalTasks: allTasks,
        completedTasks,
        completionRate: ((completedTasks / allTasks) * 100).toFixed(2),
        ...insights,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to generate insights" });
  }
};
