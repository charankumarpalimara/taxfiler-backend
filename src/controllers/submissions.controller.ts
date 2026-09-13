import { Request, Response, NextFunction } from 'express';
import { SubmissionsService } from '../services/submissions.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class SubmissionsController {
  private service: SubmissionsService;

  constructor() {
    this.service = new SubmissionsService();
  }

  public getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const submissions = await this.service.getAllSubmissions();
      ApiResponse.success(res, submissions, 'Submissions retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const submission = await this.service.getSubmissionById(id);
      if (!submission) {
        ApiResponse.error(res, `Submission with ID ${id} not found`, 404);
        return;
      }
      ApiResponse.success(res, submission, 'Submission retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const submission = await this.service.createSubmission(req.body);
      ApiResponse.success(res, submission, 'Submission created successfully', 201);
    } catch (error: any) {
      if (error.message && error.message.includes('required')) {
        ApiResponse.error(res, error.message, 400);
        return;
      }
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, staffNote } = req.body;
      const updated = await this.service.updateSubmission(id, { status, staffNote });
      ApiResponse.success(res, updated, 'Submission updated successfully');
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
      await this.service.deleteSubmission(id);
      ApiResponse.success(res, { id }, 'Submission deleted successfully');
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        ApiResponse.error(res, error.message, 404);
        return;
      }
      next(error);
    }
  };
}
