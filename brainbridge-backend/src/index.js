import 'dotenv/config';
import app from './app.js';
import config from './config/index.js';
import { logger } from './utils/logger.js';
import { connectMongo, closeMongooseConnection } from './config/mongo.js';
import { connectRedis } from './config/redis.js';

const printBanner = () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║              🚀 BrainBridge Backend Server 🚀                  ║
║                                                                ║
║     The Ultimate Learning Adventure Entry Point                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
};

const validateEnvironment = () => {
  logger.info('🔍 Validating environment variables...');
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    logger.error('❌ Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
  logger.info('✅ Environment variables validated');
};

const startServer = async () => {
  try {
    printBanner();
    validateEnvironment();

    logger.info('🔌 Connecting to databases...');
    const mongooseInstance = await connectMongo();
    await connectRedis();

    const PORT = config.port;
    const server = app.listen(PORT, () => {
      logger.info(`\n🚀 Server started on port ${PORT}`);
      logger.info(`   • Health Check: http://localhost:${PORT}/health`);
      logger.info(`   • API Base:     http://localhost:${PORT}/api/v1`);
      
      logger.info(`\n🔧 Services Status:`);
      logger.info(`   • MongoDB:     ${mongooseInstance ? '✅ Connected' : '❌ Disconnected'}`);
      logger.info(`\n✅ BrainBridge Backend is ready!`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is already in use`);
      } else {
        logger.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        logger.info('HTTP server closed');
        await closeMongooseConnection();
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
