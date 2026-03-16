import 'dotenv/config';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-brainbridge-key-123',
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  },
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000',
};

export default config;
