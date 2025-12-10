// Gateway Configuration
const config = {
  port: process.env.PORT || 3000,

  services: {
    mainService: process.env.MAIN_SERVICE_URL || "http://main-service:3001",
    aiService: process.env.AI_SERVICE_URL || "http://ai-service:5000",
  },

  cors: {
    origins: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://localhost:9090",
      "http://127.0.0.1:9090",
      "http://localhost:30080",
      "http://127.0.0.1:30080",
    ],
    credentials: true,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

module.exports = config;
