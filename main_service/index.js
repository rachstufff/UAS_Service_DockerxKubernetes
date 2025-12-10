const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const AuthController = require("./controllers/authController");
const { sendLog } = require("./utils/logger");

// Import routes
const authRoutes = require("./routes/authRoutes");
const barangRoutes = require("./routes/barangRoutes");

// Import passport configuration
const {
  configurePassport,
  GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
  isDummyCredentials,
} = require("./config/passport");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Session Middleware
app.use(
  session({
    secret: "rahasia_session_sementara",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:9090";

// Configure Passport for Google OAuth (after app.use(passport.initialize()))
configurePassport();

// Use routes
app.use("/auth", authRoutes);
app.use("/api", barangRoutes);

// GOOGLE OAUTH ROUTES - Check if real credentials are provided
if (!isDummyCredentials) {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account",
    })
  );

  app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err || !user) {
        const msg = info ? info.message : "Login Gagal";
        return res.redirect(`${FRONTEND_URL}?error=${encodeURIComponent(msg)}`);
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        const token = jwt.sign(
          { id: user.id, username: user.username, provider: "google" },
          process.env.JWT_SECRET || "dummy-secret-key",
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
  });
} else {
  console.warn(
    "Google OAuth is disabled. Using dummy credentials. Set environment variables to enable it."
  );
}

// START SERVER
if (require.main === module) {
  app.listen(3001, () => {
    console.log("Main Service running on port 3001");
  });
}

module.exports = app;
