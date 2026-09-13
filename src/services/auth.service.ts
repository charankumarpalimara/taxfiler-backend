import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUserModel, IAdminUserDocument } from '../models/admin.model.js';
import { ENVIRONMENT } from '../config/environment.js';
import { Logger } from '../utils/logger.js';

export interface AdminAuthPayload {
  adminId: string;
  email: string;
  role: string;
}

export class AuthService {
  private static isSeeded = false;

  public static async seedDefaultAdmin(): Promise<void> {
    if (AuthService.isSeeded) return;
    try {
      const count = await AdminUserModel.countDocuments();
      if (count === 0) {
        const defaultEmail = 'admin@taxfiler.com';
        const defaultPassword = 'Admin@12345';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(defaultPassword, salt);

        await AdminUserModel.create({
          id: `admin_${Date.now()}`,
          email: defaultEmail,
          passwordHash,
          name: 'Super Admin',
          role: 'superadmin',
          createdAt: new Date().toISOString(),
          lastLogin: 'Pending initial login',
        });

        Logger.info(`👑 Default Admin Account seeded into MongoDB Atlas (Email: ${defaultEmail})`);
      }
      AuthService.isSeeded = true;
    } catch (error) {
      Logger.error('Failed to seed default admin user into MongoDB:', error);
    }
  }

  public static async login(email: string, password: string): Promise<{ token: string; user: Partial<IAdminUserDocument> }> {
    await this.seedDefaultAdmin();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const admin = await AdminUserModel.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Update lastLogin timestamp
    admin.lastLogin = new Date().toISOString();
    await admin.save();

    const payload: AdminAuthPayload = {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const token = jwt.sign(payload, ENVIRONMENT.JWT_SECRET, {
      expiresIn: ENVIRONMENT.JWT_EXPIRES_IN as any,
    });

    const userObj = admin.toObject();

    return {
      token,
      user: userObj,
    };
  }

  public static verifyToken(token: string): AdminAuthPayload {
    return jwt.verify(token, ENVIRONMENT.JWT_SECRET) as AdminAuthPayload;
  }
}
