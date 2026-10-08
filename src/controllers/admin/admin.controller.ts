import { Request, Response } from 'express';
import { UserModel } from '../../models/user.model.js';
import { TaxpayerProfileModel } from '../../models/taxpayerProfile.model.js';
import { SpouseDetailsModel } from '../../models/spouseDetails.model.js';
import { DependentModel } from '../../models/dependent.model.js';
import { AddressDetailsModel } from '../../models/addressDetails.model.js';
import { ContactModel } from '../../models/contact.model.js';
import { IdentityVerificationModel } from '../../models/identityVerification.model.js';
import { BankDetailsModel } from '../../models/bankDetails.model.js';
import { DocumentUploadModel } from '../../models/documentUpload.model.js';
import { ScheduleModel } from '../../models/schedule.model.js';
import { ReferralModel } from '../../models/referral.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AdminController {
  /**
   * Get all registered clients/users with aggregated counts
   */
  public static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search, status, page, limit } = req.query;
      const query: any = {};

      if (status && status !== 'All') {
        query.portalStatus = status;
      }

      if (search) {
        const q = String(search).trim();
        query.$or = [
          { fullName: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
          { mobile: { $regex: q, $options: 'i' } },
        ];
      }

      const total = await UserModel.countDocuments(query);
      const pageNum = Math.max(1, parseInt(String(page || '1'), 10));
      const limitNum = Math.max(1, parseInt(String(limit || '10'), 10));
      const totalPages = Math.ceil(total / limitNum) || 1;
      const skip = (pageNum - 1) * limitNum;

      const users = await UserModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Enrich with document counts and taxpayer profiles
      const enriched = await Promise.all(
        users.map(async (u: any) => {
          const docCount = await DocumentUploadModel.countDocuments({ userId: u._id });
          const taxpayer = await TaxpayerProfileModel.findOne({ user: u._id }).lean();
          const id = u.id || u._id.toString();

          return {
            id,
            _id: u._id.toString(),
            clientName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
            companyName: u.companyName || (u.accountType?.includes('Business') ? 'Business Client' : 'Individual Tax Account'),
            email: u.email,
            phone: u.phone || u.mobile || 'N/A',
            clientType: u.accountType || 'Individual',
            assignedCPA: u.assignedCPA || 'David Miller, CPA',
            taxYear: '2025',
            status: u.portalStatus || 'Active',
            filingStatus: u.filingStatus || 'Documents Uploaded',
            totalFilings: docCount,
            lastFilingDate: taxpayer?.updatedAt ? new Date(taxpayer.updatedAt).toISOString().split('T')[0] : 'N/A',
            notes: u.notes || '',
            createdAt: u.createdAt || new Date().toISOString(),
          };
        })
      );

      const pagination = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      };

      ApiResponse.paginated(res, enriched, pagination, 'Users retrieved successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message || 'Failed to fetch users', 500);
    }
  }

  /**
   * Get complete user profile including taxpayer, spouse, dependents, address, contact, identity, bank, and documents
   */
  public static async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Find user by _id or custom id
      let user = await UserModel.findById(userId).lean();
      if (!user) {
        user = await UserModel.findOne({ id: userId }).lean();
      }

      if (!user) {
        ApiResponse.error(res, `User with ID ${userId} not found`, 404);
        return;
      }

      const userObjectId = user._id;

      // Fetch all user information in parallel
      const [
        taxpayer,
        spouse,
        dependents,
        address,
        contact,
        identity,
        bank,
        documents,
        schedules,
        referrals,
      ] = await Promise.all([
        TaxpayerProfileModel.findOne({ user: userObjectId }).lean(),
        SpouseDetailsModel.findOne({ user: userObjectId }).lean(),
        DependentModel.find({ user: userObjectId }).lean(),
        AddressDetailsModel.findOne({ user: userObjectId }).lean(),
        ContactModel.findOne({ user: userObjectId }).lean(),
        IdentityVerificationModel.findOne({ user: userObjectId }).lean(),
        BankDetailsModel.findOne({ user: userObjectId }).lean(),
        DocumentUploadModel.find({ userId: userObjectId }).sort({ createdAt: -1 }).lean(),
        ScheduleModel.find({ $or: [{ user: userObjectId }, { bookedBy: userObjectId }] }).lean(),
        ReferralModel.find({ user: userObjectId }).lean(),
      ]);

      const fullDetails = {
        user: {
          id: user._id.toString(),
          fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || user.mobile,
          role: user.role,
          portalStatus: user.portalStatus || 'Active',
          filingStatus: user.filingStatus || 'Documents Uploaded',
          assignedCPA: user.assignedCPA || 'David Miller, CPA',
          accountType: user.accountType || 'Individual Tax Filer',
          referralId: user.referralId,
          notes: user.notes || '',
          createdAt: user.createdAt,
        },
        taxpayer: taxpayer || null,
        spouse: spouse || null,
        dependents: dependents || [],
        address: address || null,
        contact: contact || null,
        identity: identity || null,
        bank: bank || null,
        documents: documents || [],
        schedules: schedules || [],
        referrals: referrals || [],
      };

      ApiResponse.success(res, fullDetails, 'Complete user details fetched successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message || 'Failed to fetch user details', 500);
    }
  }

  /**
   * Update client/user status, filing progress, notes, or assigned CPA
   */
  public static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { status, portalStatus, filingStatus, assignedCPA, notes, clientType, clientName, phone } = req.body;

      const updateData: any = {};
      if (status || portalStatus) updateData.portalStatus = status || portalStatus;
      if (filingStatus) updateData.filingStatus = filingStatus;
      if (assignedCPA) updateData.assignedCPA = assignedCPA;
      if (notes !== undefined) updateData.notes = notes;
      if (clientType) updateData.accountType = clientType;
      if (clientName) updateData.fullName = clientName;
      if (phone) updateData.phone = phone;

      const updated = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).lean();

      if (!updated) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      ApiResponse.success(res, updated, 'User updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message || 'Failed to update user', 500);
    }
  }

  /**
   * Get all uploaded documents across all users
   */
  public static async getAllDocuments(req: Request, res: Response): Promise<void> {
    try {
      const { status, documentType, search, page, limit } = req.query;
      const query: any = {};

      if (status && status !== 'All') {
        query.status = status;
      }

      if (documentType && documentType !== 'All') {
        query.documentType = { $regex: String(documentType), $options: 'i' };
      }

      if (search) {
        const q = String(search).trim();
        query.$or = [
          { fileName: { $regex: q, $options: 'i' } },
          { documentType: { $regex: q, $options: 'i' } },
          { person: { $regex: q, $options: 'i' } },
        ];
      }

      const total = await DocumentUploadModel.countDocuments(query);
      const pageNum = Math.max(1, parseInt(String(page || '1'), 10));
      const limitNum = Math.max(1, parseInt(String(limit || '10'), 10));
      const totalPages = Math.ceil(total / limitNum) || 1;
      const skip = (pageNum - 1) * limitNum;

      const docs = await DocumentUploadModel.find(query)
        .populate('userId', 'fullName firstName lastName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      let result = docs.map((d: any) => ({
        id: d._id.toString(),
        documentType: d.documentType,
        person: d.person,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        fileSize: d.fileSize || 0,
        status: d.status || 'Pending Review',
        reviewNotes: d.reviewNotes || '',
        createdAt: d.createdAt,
        user: d.userId
          ? {
            id: d.userId._id?.toString(),
            fullName: d.userId.fullName || `${d.userId.firstName || ''} ${d.userId.lastName || ''}`.trim(),
            email: d.userId.email,
            phone: d.userId.phone,
          }
          : null,
      }));

      const pagination = {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      };

      ApiResponse.paginated(res, result, pagination, 'All documents retrieved successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message || 'Failed to fetch documents', 500);
    }
  }

  /**
   * Review an uploaded document (Approve / Reject / Leave notes)
   */
  public static async updateDocumentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, reviewNotes } = req.body;

      if (!status) {
        ApiResponse.error(res, 'Status is required', 400);
        return;
      }

      const updated = await DocumentUploadModel.findByIdAndUpdate(
        id,
        { $set: { status, reviewNotes: reviewNotes || '' } },
        { new: true }
      ).populate('userId', 'fullName email');

      if (!updated) {
        ApiResponse.error(res, 'Document not found', 404);
        return;
      }

      ApiResponse.success(res, updated, 'Document status updated successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message || 'Failed to update document status', 500);
    }
  }

  /**
   * Delete an uploaded document
   */
  public static async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await DocumentUploadModel.findByIdAndDelete(id);

      if (!deleted) {
        ApiResponse.error(res, 'Document not found', 404);
        return;
      }

      ApiResponse.success(res, { id }, 'Document deleted successfully');
    } catch (error: any) {
      ApiResponse.error(res, error.message || 'Failed to delete document', 500);
    }
  }
}
