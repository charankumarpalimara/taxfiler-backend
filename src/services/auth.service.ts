import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUserModel, IAdminUserDocument } from '../models/admin.model.js';
import { RegistrationModel } from '../models/registration.model.js';
import { UserModel } from '../models/user.model.js';
import { ENVIRONMENT } from '../config/environment.js';
import { Logger } from '../utils/logger.js';
import { UnauthorizedError, BadRequestError } from '../errors/index.js';

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

  public static async loginAdmin(email: string, password: string): Promise<{ token: string; user: Partial<IAdminUserDocument> }> {
    await this.seedDefaultAdmin();

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await AdminUserModel.findOne({ email: cleanEmail });
    if (!admin) {
      throw new UnauthorizedError('Invalid admin email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid admin email or password');
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

  public static async loginUser(email: string, password: string): Promise<{ token: string; user: any }> {
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

    let userDoc: any = await UserModel.findOne({ email: emailRegex });
    if (!userDoc) {
      userDoc = await RegistrationModel.findOne({ email: emailRegex });
    }

    if (!userDoc) {
      Logger.warn(`User login failed: No registration or user account found for ${cleanEmail}`);
      throw new UnauthorizedError('Invalid user email or password');
    }

    const storedPassword = userDoc.password || '';

    if (!storedPassword) {
      // Legacy document before password field was added, set password
      userDoc.password = password;
      await userDoc.save();
    } else {
      let isMatch = false;
      if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, storedPassword);
      } else {
        isMatch = password === storedPassword;
      }

      if (!isMatch) {
        Logger.warn(`User login failed: Password mismatch for ${cleanEmail}`);
        throw new UnauthorizedError('Invalid user email or password');
      }
    }

    userDoc.lastLogin = new Date().toISOString();
    await userDoc.save();

    const payload: AdminAuthPayload = {
      adminId: userDoc.id,
      email: userDoc.email,
      role: userDoc.role || 'client',
    };

    const token = jwt.sign(payload, ENVIRONMENT.JWT_SECRET, {
      expiresIn: ENVIRONMENT.JWT_EXPIRES_IN as any,
    });

    return {
      token,
      user: {
        id: userDoc.id,
        fullName: userDoc.fullName || `${userDoc.firstName || ''} ${userDoc.lastName || ''}`.trim(),
        email: userDoc.email,
        phone: userDoc.phone || '',
        portalStatus: userDoc.portalStatus || 'Active',
        accountType: userDoc.accountType || 'Client Portal',
        role: userDoc.role || 'client',
      },
    };
  }

  public static async login(email: string, password: string): Promise<{ token: string; user: Partial<IAdminUserDocument> }> {
    return this.loginAdmin(email, password);
  }

  public static verifyToken(token: string): AdminAuthPayload {
    return jwt.verify(token, ENVIRONMENT.JWT_SECRET) as AdminAuthPayload;
  }
}
