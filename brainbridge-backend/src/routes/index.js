import express from 'express';
import sessionRoutes from './sessionRoutes.js';
import telemetryRoutes from './telemetryRoutes.js';
import predictionRoutes from './predictionRoutes.js';

const router = express.Router();

router.use('/sessions', sessionRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/predict', predictionRoutes);

export default router;
