import { SubmissionsRepository } from '../repositories/submissions.repository.js';
import { Submission, SubmissionStatus } from '../types/index.js';
import { EmailService } from './email.service.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

export class SubmissionsService {
  private repository: SubmissionsRepository;

  constructor() {
    this.repository = new SubmissionsRepository();
  }

  public async getAllSubmissions(): Promise<Submission[]> {
    return await this.repository.findAll();
  }

  public async getSubmissionById(id: string): Promise<Submission | undefined> {
    return await this.repository.findById(id);
  }

  public async createSubmission(payload: Partial<Submission>): Promise<Submission> {
    if (!payload.email) {
      throw new BadRequestError('Email is required for submission creation');
    }
    const created = await this.repository.create(payload);
    
    // Trigger backend email notification asynchronously (does not block response)
    EmailService.sendSubmissionNotification(created).catch(() => {});
    
    return created;
  }

  public async updateSubmission(id: string, updates: { status?: SubmissionStatus; staffNote?: string }): Promise<Submission> {
    const updated = await this.repository.update(id, updates);
    if (!updated) {
      throw new NotFoundError(`Submission with ID ${id} not found`);
    }
    return updated;
  }

  public async deleteSubmission(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Submission with ID ${id} not found`);
    }
    return true;
  }
}
