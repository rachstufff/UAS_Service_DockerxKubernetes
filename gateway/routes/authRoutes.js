const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/config");

const router = express.Router();

// Public Auth Routes (Login/Register)
router.use(
  "/",
  createProxyMiddleware({
    target: config.services.mainService,
    changeOrigin: true,
  })
);

module.exports = router;
