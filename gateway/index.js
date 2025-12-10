const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const config = require("./config/config");
const { limiter } = require("./middleware/rateLimiter");
const { verifyToken } = require("./middleware/authMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: config.cors.origins,
    credentials: config.cors.credentials,
  })
);

// Apply Rate Limiting
app.use(limiter);

// Base endpoint
app.get("/", (req, res) => {
  res.send("API Gateway Service Running... Semua sistem aman.");
});

// Route Configuration
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

// AI Service routes with path rewrite
app.use(
  "/ai",
  verifyToken,
  createProxyMiddleware({
    target: config.services.aiService,
    changeOrigin: true,
    pathRewrite: { "^/ai": "" },
  })
);

app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`);
  console.log(`Target Main Service: ${config.services.mainService}`);
  console.log(`Target AI Service: ${config.services.aiService}`);
});
