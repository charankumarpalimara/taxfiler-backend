import { RegistrationsRepository } from '../repositories/registrations.repository.js';
import { Registration, PortalStatus } from '../types/index.js';
import { EmailService } from './email.service.js';

export class RegistrationsService {
  private repository: RegistrationsRepository;

  constructor() {
    this.repository = new RegistrationsRepository();
  }

  public async getAllRegistrations(): Promise<Registration[]> {
    return await this.repository.findAll();
  }

  public async getRegistrationById(id: string): Promise<Registration | undefined> {
    return await this.repository.findById(id);
  }

  public async createRegistration(payload: Partial<Registration>): Promise<Registration> {
    if (!payload.email) {
      throw new Error('Email is required for registration');
    }
    const created = await this.repository.create(payload);

    // Trigger backend email notification asynchronously (does not block response)
    EmailService.sendRegistrationNotification(created).catch(() => {});

    return created;
  }

  public async updateRegistrationStatus(id: string, portalStatus: PortalStatus): Promise<Registration> {
    const updated = await this.repository.updateStatus(id, portalStatus);
    if (!updated) {
      throw new Error(`Registration with ID ${id} not found`);
    }
    return updated;
  }

  public async deleteRegistration(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error(`Registration with ID ${id} not found`);
    }
    return true;
  }
}
