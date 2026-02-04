const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require("../middleware/authMiddleware");

console.log("🤖 AI routes module loaded");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Test route - NO AUTH
router.get("/test", (req, res) => {
  res.json({ message: "AI routes working!" });
});

// @route   POST /api/ai/generate-tasks
// @desc    Generate tasks using AI
// @access  Private
router.post("/generate-tasks", protect, async (req, res) => {
  console.log("🎯 AI generate-tasks route hit!");
  console.log("Request body:", req.body);
  
  try {
    const { projectName, description, count } = req.body;

    if (!projectName) {
      return res.status(400).json({ message: "Project name is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log("❌ Gemini API key not configured");
      // Return mock data if no API key
      const mockTasks = [
        {
          title: "Setup project structure",
          description: "Initialize the basic project structure",
          priority: "high",
          labels: ["Feature"]
        },
        {
          title: "Design database schema",
          description: "Create MongoDB schema design",
          priority: "medium",
          labels: ["Design", "Documentation"]
        },
        {
          title: "Implement authentication",
          description: "Add user authentication system",
          priority: "high",
          labels: ["Feature", "Bug"]
        },
        {
          title: "Create API endpoints",
          description: "Build RESTful API endpoints",
          priority: "medium",
          labels: ["Feature"]
        },
        {
          title: "Write documentation",
          description: "Document API and setup process",
          priority: "low",
          labels: ["Documentation"]
        }
      ];
      console.log("⚠️ Using mock data (no API key)");
      return res.json(mockTasks);
    }

    // Use the most stable model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    
    const prompt = `Generate ${count || 5} realistic project management tasks for a project called "${projectName}"${
      description ? ` with description: ${description}` : ""
    }.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "title": "Task title",
    "description": "Detailed task description",
    "priority": "low",
    "labels": ["Feature"]
  },
  {
    "title": "Another task",
    "description": "Another description",
    "priority": "medium",
    "labels": ["Bug", "Enhancement"]
  }
]

Priority must be: low, medium, or high
Labels must be from: Feature, Bug, Enhancement, Documentation, Design`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ AI Raw Response:", text);

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log("❌ No valid JSON found in AI response");
      return res.status(500).json({ message: "AI returned invalid format" });
    }

    const tasks = JSON.parse(jsonMatch[0]);
    console.log("✅ AI Generated Tasks:", tasks.length);
    
    res.json(tasks);
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    res.status(500).json({ 
      message: error.message || "Failed to generate tasks with AI" 
    });
  }
});

console.log("🤖 AI routes configured");
module.exports = router;
