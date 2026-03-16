import Telemetry from '../models/Telemetry.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { BadRequestError } from '../utils/customErrors.js';

export const saveTelemetry = async (req, res, next) => {
  try {
    const { session_id, game, ...stats } = req.body;
    
    if (!session_id || !game) {
      throw new BadRequestError('session_id and game are required');
    }

    // Extract core metrics if they exist in stats, otherwise use additional_metrics
    const { reaction_time, error_count, completion_time, ...additional_metrics } = stats;

    const telemetry = await Telemetry.create({
      session_id,
      game,
      reaction_time: reaction_time || stats.reaction_time_avg,
      error_count: error_count || stats.errors || stats.total_errors,
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
