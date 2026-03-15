import Telemetry from '../models/Telemetry.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { BadRequestError } from '../utils/customErrors.js';

export const saveTelemetry = async (req, res, next) => {
  try {
    const { session_id, game, reaction_time, errors, completion_time, additional_metrics } = req.body;
    
    if (!session_id || !game) {
      throw new BadRequestError('session_id and game are required');
    }

    const telemetry = await Telemetry.create({
      session_id,
      game,
      reaction_time,
      errors,
      completion_time,
      additional_metrics
    });

    return successResponse(res, telemetry, 'Telemetry saved successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getSessionTelemetry = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const telemetry = await Telemetry.find({ session_id: sessionId });
    return successResponse(res, telemetry);
  } catch (error) {
    next(error);
  }
};
