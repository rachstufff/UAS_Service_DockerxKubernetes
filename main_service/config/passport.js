const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { sendLog } = require("../utils/logger");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

function configurePassport() {
  // Always setup serialization
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // Only setup Google Strategy if REAL credentials are provided (not dummy)
  const isDummyCredentials = GOOGLE_CLIENT_ID === "undefined";

  if (!isDummyCredentials) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: GOOGLE_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, cb) {
          const email = profile.emails[0].value;

          User.findByUsername(email, (err, results) => {
            if (err) return cb(err);

            if (results.length > 0) {
              const user = JSON.parse(JSON.stringify(results[0]));
              if (user.password !== null && user.provider === "manual") {
                return cb(null, false, {
                  message: "Username sudah terdaftar manual.",
                });
              }
              return cb(null, user);
            } else {
              User.create(email, null, "google", (err, result) => {
                if (err) return cb(err);

                sendLog(
                  "MAIN_SERVICE",
                  "REGISTER_GOOGLE",
                  `User baru via Google: ${email}`
                );

                return cb(null, {
                  id: result.insertId,
                  username: email,
                  provider: "google",
                });
              });
            }
          });
        }
      )
    );
  } else {
    console.warn(
      "⚠️ WARNING: Using dummy Google OAuth credentials. Google login will be disabled."
    );
    console.warn(
      "To enable Google OAuth, set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL environment variables."
    );
  }
}

module.exports = {
  configurePassport,
  GOOGLE_CLIENT_ID,
  GOOGLE_CALLBACK_URL,
  isDummyCredentials: GOOGLE_CLIENT_ID === "undefined",
};
