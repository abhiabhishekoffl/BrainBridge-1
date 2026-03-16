import Session from '../models/Session.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { BadRequestError, NotFoundError } from '../utils/customErrors.js';

export const createSession = async (req, res, next) => {
  try {
    const { child_id, language } = req.body;
    const session = await Session.create({ 
      user: req.user.id, 
      child_id,
      language 
    });

    return successResponse(res, session, 'Session created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ _id: id, user: req.user.id });
    if (!session) {
      throw new NotFoundError('Session not found or unauthorized');
    }
    return successResponse(res, session);
  } catch (error) {
    next(error);
  }
};

export const updateSessionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: id, user: req.user.id }, 
      { status }, 
      { new: true }
    );
    if (!session) {
      throw new NotFoundError('Session not found or unauthorized');
    }
    return successResponse(res, session, 'Session status updated');
  } catch (error) {
    next(error);
  }
};
