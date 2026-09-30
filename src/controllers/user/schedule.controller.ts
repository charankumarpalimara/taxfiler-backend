import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ScheduleModel } from '../../models/schedule.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const getAvailableSchedules = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const available = await ScheduleModel.find({ status: 'available' });
    ApiResponse.success(res, available, 'Available schedules fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch available schedules', 500);
  }
};

export const getMyAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const appointments = await ScheduleModel.find({
      $or: [{ user: userId }, { bookedBy: userId }],
    }).sort({ createdAt: -1 });

    ApiResponse.success(res, appointments, 'User appointments fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch appointments', 500);
  }
};

export const bookSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { scheduleId, reason, preferredMethod } = req.body;

    const schedule = await ScheduleModel.findById(scheduleId);
    if (!schedule) {
      ApiResponse.error(res, 'Schedule slot not found', 404);
      return;
    }

    schedule.user = userId as any;
    schedule.bookedBy = userId as any;
    schedule.status = 'booked';
    if (reason) schedule.reason = reason;
    if (preferredMethod) schedule.preferredMethod = preferredMethod;

    await schedule.save();

    ApiResponse.success(res, schedule, 'Appointment booked successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to book appointment', 500);
  }
};

export const requestSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { date, startTime, timezone, reason, preferredMethod } = req.body;

    const newRequest = await ScheduleModel.create({
      user: userId,
      bookedBy: userId,
      date: date || new Date().toISOString().split('T')[0],
      startTime: startTime || '10:00 AM',
      timezone: timezone || 'CST',
      reason: reason || 'Tax Consultation Request',
      preferredMethod: preferredMethod || 'phone',
      requestType: 'custom',
      status: 'booked',
    });

    ApiResponse.success(res, newRequest, 'Custom consultation slot requested successfully', 201);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to request consultation slot', 500);
  }
};
