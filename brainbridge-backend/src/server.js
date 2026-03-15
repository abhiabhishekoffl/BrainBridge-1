import 'dotenv/config';
import app from './app.js';
import connectMongo from './config/mongo.js';
import { connectRedis } from './config/redis.js';

// Connect Databases
const startServer = async () => {
  try {
    await connectMongo();
    await connectRedis();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 BrainBridge Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

