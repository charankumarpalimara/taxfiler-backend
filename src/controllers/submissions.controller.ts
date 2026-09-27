import { Request, Response } from 'express';
import { SubmissionsService } from '../services/submissions.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../errors/index.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class SubmissionsController {
  private service: SubmissionsService;

  constructor() {
    this.service = new SubmissionsService();
  }

  public getAll = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const submissions = await this.service.getAllSubmissions();
    ApiResponse.success(res, submissions, 'Submissions retrieved successfully');
  });

  public getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const submission = await this.service.getSubmissionById(id);
    if (!submission) {
      throw new NotFoundError(`Submission with ID ${id} not found`);
    }
    ApiResponse.success(res, submission, 'Submission retrieved successfully');
  });

  public create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const submission = await this.service.createSubmission(req.body);
    ApiResponse.success(res, submission, 'Submission created successfully', HTTP_STATUS.CREATED);
  });

  public update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, staffNote } = req.body;
    const updated = await this.service.updateSubmission(id, { status, staffNote });
    ApiResponse.success(res, updated, 'Submission updated successfully');
  });

  public delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.service.deleteSubmission(id);
    ApiResponse.success(res, { id }, 'Submission deleted successfully');
  });
}
