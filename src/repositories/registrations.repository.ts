import fs from 'fs';
import path from 'path';
import { RegistrationModel } from '../models/registration.model.js';
import { UserModel } from '../models/user.model.js';
import { Registration, PortalStatus } from '../types/index.js';
import { Logger } from '../utils/logger.js';

const DATA_FILE = path.resolve(__dirname, '../../../data/registrations.json');

export class RegistrationsRepository {
  private static isSeeded = false;

  private async seedIfNeeded(): Promise<void> {
    if (RegistrationsRepository.isSeeded) return;
    try {
      const count = await RegistrationModel.countDocuments();
      if (count === 0 && fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const seedData: Registration[] = JSON.parse(raw);
        if (seedData.length > 0) {
          await RegistrationModel.insertMany(seedData);
          Logger.info(`🌱 Seeded ${seedData.length} registrations into MongoDB`);
        }
      }
      RegistrationsRepository.isSeeded = true;
    } catch (error) {
      Logger.error('Failed to seed initial registrations into MongoDB:', error);
    }
  }

  public async findAll(): Promise<Registration[]> {
    await this.seedIfNeeded();
    const docs = await RegistrationModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc: any) => {
      const { _id, __v, ...rest } = doc;
      return rest as Registration;
    });
  }

  public async findById(id: string): Promise<Registration | undefined> {
    await this.seedIfNeeded();
    const doc = await RegistrationModel.findOne({ id }).lean();
    if (!doc) return undefined;
    const { _id, __v, ...rest } = doc as any;
    return rest as Registration;
  }

  public async create(payload: Partial<Registration>): Promise<Registration> {
    await this.seedIfNeeded();
    const cleanEmail = (payload.email || '').toLowerCase().trim();
    const newRegistrationData = {
      id: `reg_${Date.now()}`,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      fullName: payload.fullName || `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'Portal Client',
      email: cleanEmail,
      password: payload.password || '',
      phone: payload.phone || '',
      portalStatus: (payload.portalStatus as PortalStatus) || 'Pending Review',
      accountType: payload.accountType || 'Business Portal',
      createdAt: new Date().toISOString(),
      lastLogin: 'Pending first login',
    };

    const created = await RegistrationModel.create(newRegistrationData);

    // Sync to UserModel for user authentication
    try {
      await UserModel.findOneAndUpdate(
        { email: cleanEmail },
        {
          $set: {
            id: newRegistrationData.id,
            firstName: newRegistrationData.firstName,
            lastName: newRegistrationData.lastName,
            fullName: newRegistrationData.fullName,
            email: cleanEmail,
            phone: newRegistrationData.phone,
            password: newRegistrationData.password,
            role: 'client',
            portalStatus: newRegistrationData.portalStatus,
            accountType: newRegistrationData.accountType,
            createdAt: newRegistrationData.createdAt,
            lastLogin: newRegistrationData.lastLogin,
          },
        },
        { upsert: true, new: true }
      );
    } catch (userErr) {
      Logger.warn('Notice syncing user to UserModel:', userErr);
    }

    const obj = created.toObject();
    const { _id, __v, ...rest } = obj as any;
    return rest as Registration;
  }

  public async updateStatus(id: string, portalStatus: PortalStatus): Promise<Registration | null> {
    await this.seedIfNeeded();
    const updated = await RegistrationModel.findOneAndUpdate(
      { id },
      { $set: { portalStatus, updatedAt: new Date().toISOString() } },
      { new: true }
    ).lean();

    if (!updated) return null;
    const { _id, __v, ...rest } = updated as any;
    return rest as Registration;
  }

  public async delete(id: string): Promise<boolean> {
    await this.seedIfNeeded();
    const res = await RegistrationModel.deleteOne({ id });
    return res.deletedCount > 0;
  }
}
