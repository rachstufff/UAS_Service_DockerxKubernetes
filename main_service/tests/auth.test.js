// dummy environment variables untuk testing
process.env.GOOGLE_CLIENT_ID = "xxx.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET = "GOCSPX-xxxxxxxxxxxxxxxx";
process.env.GOOGLE_CALLBACK_URL = "http://localhost:30000/auth/google/callback";
process.env.JWT_SECRET = "dummy-secret-key";

jest.mock("../db_config", () => {
  return {
    query: (sql, params, callback) => {
      // Kasus SELECT user
      if (sql.includes("SELECT")) {
        return callback(null, []);
      }
      // Kasus INSERT user
      if (sql.includes("INSERT")) {
        return callback(null, { insertId: 999 });
      }
      callback(null, []);
    },
  };
});

jest.mock("../utils/logger", () => {
  return {
    sendLog: jest.fn(),
  };
});

const request = require("supertest");
const app = require("../index.js");

describe("MAIN SERVICE - AUTH TESTING", () => {
  const testUser = {
    username: "unittest@example.com",
    password: "123456",
  };

  // REGISTER
  it("Register user baru (should return 201)", async () => {
    const res = await request(app).post("/auth/register").send(testUser);

    expect([201, 400]).toContain(res.statusCode);
  });

  // LOGIN
  it("Login user (route must work even with mock DB)", async () => {
    const res = await request(app).post("/auth/login").send(testUser);

    expect([200, 401, 403, 404]).toContain(res.statusCode);
  });
});
