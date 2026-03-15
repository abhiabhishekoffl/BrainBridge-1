import axios from 'axios';
import Result from '../models/Result.js';
import Session from '../models/Session.js';
import Telemetry from '../models/Telemetry.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { BadRequestError } from '../utils/customErrors.js';

export const runPrediction = async (req, res, next) => {
  try {
    const { session_id } = req.body;
    
    if (!session_id) {
      throw new BadRequestError('session_id is required');
    }

    const telemetryData = await Telemetry.find({ session_id });
    
    if (!telemetryData || telemetryData.length === 0) {
      throw new BadRequestError('No telemetry data found for this session');
    }

    let totalReactionTime = 0;
    let totalErrors = 0;
    let count = 0;
    
    telemetryData.forEach(t => {
      if (t.reaction_time) totalReactionTime += t.reaction_time;
      if (t.errors) totalErrors += t.errors;
      count++;
    });

    const reaction_time_avg = count > 0 ? totalReactionTime / count : 0;
    const error_rate = count > 0 ? totalErrors / count : 0; 
    
    const features = {
      reaction_time_avg,
      error_rate,
      math_accuracy: 0.8,
      mirror_error_rate: 0.2 
    };

    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, features);
    
    const result = await Result.create({
      session_id,
      adhd_risk: mlResponse.data.adhd_risk,
      dyslexia_risk: mlResponse.data.dyslexia_risk,
      dyscalculia_risk: mlResponse.data.dyscalculia_risk
    });

    await Session.findByIdAndUpdate(session_id, { status: 'completed' });

    return successResponse(res, result, 'Prediction completed successfully');
  } catch (error) {
    next(error);
  }
};
