const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { verifyToken } = require("../middleware/authMiddleware");
const config = require("../config/config");

const router = express.Router();

// Protected API Routes (Main Service - Barang)
router.use(
  "/",
  verifyToken,
  createProxyMiddleware({
    target: config.services.mainService,
    changeOrigin: true,
  })
);

module.exports = router;
