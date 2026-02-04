const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// Middleware to remove data operators (NoSQL injection)
const mongoSanitizer = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`Potential NoSQL injection attempt on key: ${key}`);
  },
});

// Helmet security headers
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

module.exports = {
  mongoSanitizer,
  helmetMiddleware,
};
