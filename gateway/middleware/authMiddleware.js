const jwt = require("jsonwebtoken");
const { sendLog } = require("../utils/logger");

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware Verifikasi Token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    sendLog(
      "API_GATEWAY",
      "AUTH_MISSING",
      `Token tidak ditemukan dari IP: ${req.ip}`
    );
    return res
      .status(401)
      .json({ message: "Akses Ditolak: Token tidak ditemukan!" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      sendLog("API_GATEWAY", "AUTH_FAILED", `Token invalid dari IP: ${req.ip}`);
      return res
        .status(403)
        .json({ message: "Akses Ditolak: Token tidak valid!" });
    }

    req.user = user;

    // Log Aktivitas Sukses
    sendLog(
      "API_GATEWAY",
      "REQUEST_PASSED",
      `User: ${user.username} mengakses ${req.originalUrl}`
    );

    next();
  });
};

module.exports = { verifyToken };
