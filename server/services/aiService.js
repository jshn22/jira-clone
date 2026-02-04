const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTasksFromDescription = async (projectDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
You are a project management expert. Given a project description, generate a JSON array of tasks.
Each task should have: title (string), description (string), priority (low/medium/high), estimatedHours (number).

Project Description: "${projectDescription}"

Generate 5-8 relevant tasks. Return ONLY valid JSON array, no other text.
Example format:
[
  {
    "title": "Setup project environment",
    "description": "Initialize project structure and dependencies",
    "priority": "high",
    "estimatedHours": 2
  }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Invalid response format");
    
    const tasks = JSON.parse(jsonMatch[0]);
    return tasks;
  } catch (err) {
    console.error("AI Task Generation Error:", err);
    throw new Error("Failed to generate tasks");
  }
};

const breakdownTaskIntoSubtasks = async (taskTitle, taskDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
You are a project management expert. Break down a task into 3-5 specific subtasks.
Each subtask should be actionable and clear.

Task Title: "${taskTitle}"
Task Description: "${taskDescription}"

Return ONLY a JSON array of subtasks with title and description fields.
Example format:
[
  {
    "title": "Research requirements",
    "description": "Study and document all requirements"
  }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Invalid response format");
    
    const subtasks = JSON.parse(jsonMatch[0]);
    return subtasks;
  } catch (err) {
    console.error("Subtask Generation Error:", err);
    throw new Error("Failed to generate subtasks");
  }
};

const generateSprintPlan = async (projectDescription, teamSize) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
You are a scrum master. Create a sprint planning recommendation for a project.

Project: "${projectDescription}"
Team Size: ${teamSize} members

Generate sprint structure with phases, estimated duration, and milestones.
Return ONLY valid JSON with: phases (array), sprintDuration (number in days), milestones (array).
Example format:
{
  "phases": [
    {
      "name": "Phase 1: Design",
      "duration": 5,
      "tasks": ["Design system", "Create mockups"]
    }
  ],
  "sprintDuration": 14,
  "milestones": ["MVP Ready", "Beta Release"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    
    const plan = JSON.parse(jsonMatch[0]);
    return plan;
  } catch (err) {
    console.error("Sprint Planning Error:", err);
    throw new Error("Failed to generate sprint plan");
  }
};

const generateInsights = async (tasks, completedTasks) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const completionRate = (completedTasks / tasks) * 100;

    const prompt = `
You are a project analytics expert. Provide actionable insights based on project progress.

Total Tasks: ${tasks}
Completed Tasks: ${completedTasks}
Completion Rate: ${completionRate.toFixed(2)}%

Provide 3 key insights and recommendations in JSON format.
Return ONLY valid JSON with: insights (array of strings), recommendations (array of strings).
Example format:
{
  "insights": ["Insight 1", "Insight 2"],
  "recommendations": ["Recommendation 1"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");
    
    const data = JSON.parse(jsonMatch[0]);
    return data;
  } catch (err) {
    console.error("Insights Generation Error:", err);
    throw new Error("Failed to generate insights");
  }
};

module.exports = {
  generateTasksFromDescription,
  breakdownTaskIntoSubtasks,
  generateSprintPlan,
  generateInsights,
};
