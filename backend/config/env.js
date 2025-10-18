// Lightweight env loader (optional)
require('dotenv').config();
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  AI_ENGINE_URL: process.env.AI_ENGINE_URL,
  AI_ENGINE_TOKEN: process.env.AI_ENGINE_TOKEN
};
