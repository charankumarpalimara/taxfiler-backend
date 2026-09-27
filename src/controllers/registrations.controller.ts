import { Request, Response } from 'express';
import { RegistrationsService } from '../services/registrations.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../errors/index.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class RegistrationsController {
  private service: RegistrationsService;

  constructor() {
    this.service = new RegistrationsService();
  }

  public getAll = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const registrations = await this.service.getAllRegistrations();
    ApiResponse.success(res, registrations, 'Registrations retrieved successfully');
  });

  public getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const registration = await this.service.getRegistrationById(id);
    if (!registration) {
      throw new NotFoundError(`Registration with ID ${id} not found`);
    }
    ApiResponse.success(res, registration, 'Registration retrieved successfully');
  });

  public create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const registration = await this.service.createRegistration(req.body);
    ApiResponse.success(res, registration, 'Registration created successfully', HTTP_STATUS.CREATED);
  });

  public updateStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { portalStatus } = req.body;
    const updated = await this.service.updateRegistrationStatus(id, portalStatus);
    ApiResponse.success(res, updated, 'Registration status updated successfully');
  });

  public delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.service.deleteRegistration(id);
    ApiResponse.success(res, { id }, 'Registration deleted successfully');
  });
}
