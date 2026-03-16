import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { NotFoundError } from './utils/customErrors.js';
import { logger } from './utils/logger.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Adjust as needed for production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Performance Middlewares
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: message => logger.http(message.trim()) }
  }));
}

// API Routes
app.use('/api/v1', routes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
