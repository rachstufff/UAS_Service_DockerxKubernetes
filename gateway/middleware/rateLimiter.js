const rateLimit = require("express-rate-limit");

// Rate Limiting Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Terlalu banyak request dari IP ini, coba lagi nanti.",
});

module.exports = { limiter };
