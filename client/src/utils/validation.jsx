export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateProjectName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Project name must be at least 2 characters";
  }
  if (name.length > 100) {
    return "Project name must not exceed 100 characters";
  }
  return null;
};

export const validateTaskTitle = (title) => {
  if (!title || title.trim().length < 2) {
    return "Task title must be at least 2 characters";
  }
  if (title.length > 200) {
    return "Task title must not exceed 200 characters";
  }
  return null;
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "")
    .trim();
};
