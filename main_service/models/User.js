const bcrypt = require("bcryptjs");
const db = require("../db_config");

class User {
  // Find user by username
  static findByUsername(username, callback) {
    db.query("SELECT * FROM users WHERE username = ?", [username], callback);
  }

  // Create new user
  static create(username, password, provider, callback) {
    const hashedPassword = password ? bcrypt.hashSync(password, 8) : null;
    db.query(
      "INSERT INTO users (username, password, provider) VALUES (?, ?, ?)",
      [username, hashedPassword, provider],
      callback
    );
  }

  // Compare password
  static comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  // Check if user exists
  static async exists(username) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) as count FROM users WHERE username = ?",
        [username],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count > 0);
        }
      );
    });
  }
}

module.exports = User;
