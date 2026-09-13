import { Request, Response, NextFunction } from 'express';
import { RegistrationsService } from '../services/registrations.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class RegistrationsController {
  private service: RegistrationsService;

  constructor() {
    this.service = new RegistrationsService();
  }

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registrations = await this.service.getAllRegistrations();
      ApiResponse.success(res, registrations, 'Registrations retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const registration = await this.service.getRegistrationById(id);
      if (!registration) {
        ApiResponse.error(res, `Registration with ID ${id} not found`, 404);
        return;
      }
      ApiResponse.success(res, registration, 'Registration retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registration = await this.service.createRegistration(req.body);
      ApiResponse.success(res, registration, 'Registration created successfully', 201);
    } catch (error: any) {
      if (error.message && error.message.includes('required')) {
        ApiResponse.error(res, error.message, 400);
        return;
      }
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { portalStatus } = req.body;
      if (!portalStatus) {
        ApiResponse.error(res, 'portalStatus parameter is required', 400);
        return;
      }
      const updated = await this.service.updateRegistrationStatus(id, portalStatus);
      ApiResponse.success(res, updated, 'Registration status updated successfully');
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        ApiResponse.error(res, error.message, 404);
        return;
      }
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.deleteRegistration(id);
      ApiResponse.success(res, { id }, 'Registration deleted successfully');
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        ApiResponse.error(res, error.message, 404);
        return;
      }
      next(error);
    }
  };
}
