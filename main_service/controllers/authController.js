const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendLog } = require("../utils/logger");

const SECRET_KEY = process.env.JWT_SECRET || "dummy-secret-key";

class AuthController {
  // Register new user
  static register(req, res) {
    const { username, password } = req.body;

    User.findByUsername(username, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error saat pengecekan user." });
      }

      if (results.length > 0) {
        const user = results[0];

        if (user.provider === "google") {
          return res.status(400).json({
            success: false,
            message:
              "Email ini sudah terdaftar via Google. Silakan Login menggunakan Google.",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Username/Email sudah digunakan oleh akun lain.",
          });
        }
      }

      User.create(username, password, "manual", (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Gagal mendaftarkan user." });
        }

        sendLog(
          "MAIN_SERVICE",
          "REGISTER_MANUAL",
          `User baru terdaftar: ${username}`
        );

        res
          .status(201)
          .json({ message: "User berhasil didaftarkan. Silakan Login." });
      });
    });
  }

  // Login user
  static login(req, res) {
    const { username, password } = req.body;

    User.findByUsername(username, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error saat login." });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const user = results[0];

      if (user.provider === "google") {
        return res.status(403).json({
          message:
            "Email ini terdaftar via Google. Harap gunakan tombol Login Google.",
        });
      }

      if (!User.comparePassword(password, user.password)) {
        return res.status(401).json({ message: "Password salah" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: 86400 }
      );

      sendLog(
        "MAIN_SERVICE",
        "LOGIN_SUCCESS",
        `User ${username} berhasil login manual.`
      );

      res.status(200).json({ auth: true, token: token });
    });
  }

  // Google OAuth callback handler
  static googleCallback(req, res, next, passport, FRONTEND_URL) {
    passport.authenticate("google", (err, user, info) => {
      if (err || !user) {
        const msg = info ? info.message : "Login Gagal";
        return res.redirect(
          `http://localhost:8080?error=${encodeURIComponent(msg)}`
        );
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        const token = jwt.sign(
          { id: user.id, username: user.username, provider: "google" },
          SECRET_KEY,
          { expiresIn: 86400 }
        );

        sendLog(
          "MAIN_SERVICE",
          "LOGIN_GOOGLE",
          `User ${user.username} login via Google.`
        );

        res.redirect(`${FRONTEND_URL}?token=${token}`);
      });
    })(req, res, next);
  }
}

module.exports = AuthController;
