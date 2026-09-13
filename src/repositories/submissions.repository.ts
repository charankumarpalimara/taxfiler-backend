import fs from 'fs';
import path from 'path';
import { SubmissionModel } from '../models/submission.model.js';
import { Submission, SubmissionStatus } from '../types/index.js';
import { Logger } from '../utils/logger.js';

const DATA_FILE = path.resolve(__dirname, '../../../data/submissions.json');

export class SubmissionsRepository {
  private static isSeeded = false;

  private async seedIfNeeded(): Promise<void> {
    if (SubmissionsRepository.isSeeded) return;
    try {
      const count = await SubmissionModel.countDocuments();
      if (count === 0 && fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const seedData: Submission[] = JSON.parse(raw);
        if (seedData.length > 0) {
          await SubmissionModel.insertMany(seedData);
          Logger.info(`🌱 Seeded ${seedData.length} submissions into MongoDB`);
        }
      }
      SubmissionsRepository.isSeeded = true;
    } catch (error) {
      Logger.error('Failed to seed initial submissions into MongoDB:', error);
    }
  }

  public async findAll(): Promise<Submission[]> {
    await this.seedIfNeeded();
    const docs = await SubmissionModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc: any) => {
      const { _id, __v, ...rest } = doc;
      return rest as Submission;
    });
  }

  public async findById(id: string): Promise<Submission | undefined> {
    await this.seedIfNeeded();
    const doc = await SubmissionModel.findOne({ id }).lean();
    if (!doc) return undefined;
    const { _id, __v, ...rest } = doc as any;
    return rest as Submission;
  }

  public async create(payload: Partial<Submission>): Promise<Submission> {
    await this.seedIfNeeded();
    const newSubmissionData = {
      id: `sub_${Date.now()}`,
      type: payload.type || 'consultation',
      firstName: payload.firstName,
      lastName: payload.lastName,
      clientName: payload.clientName || `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'Valued Client',
      email: payload.email || '',
      phone: payload.phone || '',
      preferredLanguage: payload.preferredLanguage || 'English',
      scheduledDate: payload.scheduledDate || 'Not Scheduled',
      scheduledTime: payload.scheduledTime || '10:00 AM CST',
      services: payload.services || ['Tax Preparation'],
      leadSource: payload.leadSource || 'Website Direct',
      notes: payload.notes || '',
      staffNote: payload.staffNote || '',
      status: (payload.status as SubmissionStatus) || 'New',
      createdAt: new Date().toISOString(),
    };

    const created = await SubmissionModel.create(newSubmissionData);
    const obj = created.toObject();
    const { _id, __v, ...rest } = obj as any;
    return rest as Submission;
  }

  public async update(id: string, updates: { status?: SubmissionStatus; staffNote?: string }): Promise<Submission | null> {
    await this.seedIfNeeded();
    const updatePayload: any = { updatedAt: new Date().toISOString() };
    if (updates.status) updatePayload.status = updates.status;
    if (updates.staffNote !== undefined) updatePayload.staffNote = updates.staffNote;

    const updated = await SubmissionModel.findOneAndUpdate(
      { id },
      { $set: updatePayload },
      { new: true }
    ).lean();

    if (!updated) return null;
    const { _id, __v, ...rest } = updated as any;
    return rest as Submission;
  }

  public async delete(id: string): Promise<boolean> {
    await this.seedIfNeeded();
    const res = await SubmissionModel.deleteOne({ id });
    return res.deletedCount > 0;
  }
}
