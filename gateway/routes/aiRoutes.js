const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { verifyToken } = require("../middleware/authMiddleware");
const config = require("../config/config");

const router = express.Router();

// Protected AI Service Routes
router.use(
  "/",
  verifyToken,
  createProxyMiddleware({
    target: config.services.aiService,
    changeOrigin: true,
  })
);

module.exports = router;
