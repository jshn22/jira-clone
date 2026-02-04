const validator = require("validator");

const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ message: "Name must be between 2 and 50 characters" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // Sanitize inputs
  req.body.name = validator.trim(validator.escape(name));
  req.body.email = validator.trim(validator.normalizeEmail(email));

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  req.body.email = validator.trim(validator.normalizeEmail(email));

  next();
};

const validateProject = (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  if (name.length < 2 || name.length > 100) {
    return res.status(400).json({ message: "Project name must be between 2 and 100 characters" });
  }

  if (description && description.length > 500) {
    return res.status(400).json({ message: "Description must not exceed 500 characters" });
  }

  req.body.name = validator.trim(validator.escape(name));
  if (description) {
    req.body.description = validator.trim(validator.escape(description));
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title, description, priority } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  if (title.length < 2 || title.length > 200) {
    return res.status(400).json({ message: "Task title must be between 2 and 200 characters" });
  }

  if (description && description.length > 2000) {
    return res.status(400).json({ message: "Description must not exceed 2000 characters" });
  }

  if (priority && !["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ message: "Invalid priority level" });
  }

  req.body.title = validator.trim(validator.escape(title));
  if (description) {
    req.body.description = validator.trim(validator.escape(description));
  }

  next();
};

const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName] || req.body[paramName];

  if (!id || !validator.isMongoId(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateProject,
  validateTask,
  validateObjectId,
};
