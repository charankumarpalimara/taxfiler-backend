import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { TaxpayerProfileModel } from '../../models/taxpayerProfile.model.js';
import { SpouseDetailsModel } from '../../models/spouseDetails.model.js';
import { AddressDetailsModel } from '../../models/addressDetails.model.js';
import { ContactModel } from '../../models/contact.model.js';
import { IdentityVerificationModel } from '../../models/identityVerification.model.js';
import { BankDetailsModel } from '../../models/bankDetails.model.js';
import { DependentModel } from '../../models/dependent.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

// 1. Taxpayer Profile
export const saveProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { firstName, middleName, lastName, ssn, dob, dateOfBirth, filingStatus, occupation } = req.body;

    const data = {
      user: userId,
      firstName: firstName || '',
      middleName: middleName || '',
      lastName: lastName || '',
      ssn: ssn || '',
      dob: dob || dateOfBirth || '',
      filingStatus: filingStatus || 'Single',
      occupation: occupation || '',
    };

    const updated = await TaxpayerProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: data },
      { new: true, upsert: true }
    );

    ApiResponse.success(res, updated, 'Taxpayer profile saved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to save taxpayer profile', 500);
  }
};

export const listTaxpayerProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const profile = await TaxpayerProfileModel.findOne({ user: userId });
    ApiResponse.success(res, profile || {}, 'Taxpayer profile fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch taxpayer profile', 500);
  }
};

// 2. Spouse Details
export const spousesaveProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { firstName, middleName, lastName, ssn, dob, dateOfBirth } = req.body;

    const data = {
      user: userId,
      firstName: firstName || '',
      middleName: middleName || '',
      lastName: lastName || '',
      ssn: ssn || '',
      dob: dob || dateOfBirth || '',
    };

    const updated = await SpouseDetailsModel.findOneAndUpdate(
      { user: userId },
      { $set: data },
      { new: true, upsert: true }
    );

    ApiResponse.success(res, updated, 'Spouse details saved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to save spouse details', 500);
  }
};

export const spouselist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const spouse = await SpouseDetailsModel.findOne({ user: userId });
    ApiResponse.success(res, spouse || {}, 'Spouse details fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch spouse details', 500);
  }
};

// 3. Address Details
export const saveAddress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentAddress, taxYearAddress, street, city, state, zipCode } = req.body;

    const curr = currentAddress || { street, city, state, zipCode };
    const taxYr = taxYearAddress || curr;

    const updated = await AddressDetailsModel.findOneAndUpdate(
      { user: userId },
      { $set: { user: userId, currentAddress: curr, taxYearAddress: taxYr } },
      { new: true, upsert: true }
    );

    ApiResponse.success(res, updated, 'Address saved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to save address', 500);
  }
};

export const addressList = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const address = await AddressDetailsModel.findOne({ user: userId });
    ApiResponse.success(res, address || {}, 'Address details fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch address details', 500);
  }
};

// 4. Contact Details
export const saveContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { email, phone, alternateEmail, alternatePhone } = req.body;

    const updated = await ContactModel.findOneAndUpdate(
      { user: userId },
      { $set: { user: userId, email, phone, alternateEmail, alternatePhone } },
      { new: true, upsert: true }
    );

    ApiResponse.success(res, updated, 'Contact details saved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to save contact details', 500);
  }
};

export const getContact = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const contact = await ContactModel.findOne({ user: userId });
    ApiResponse.success(res, contact || {}, 'Contact details fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch contact details', 500);
  }
};

// 5. Identity Verification
export const saveIdentity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { licenseNumber, stateOfIssue, expirationDate } = req.body;

    let licenseDocument = req.body.licenseDocument || '';
    if (req.file) {
      licenseDocument = `/uploads/${req.file.filename}`;
    }

    const updated = await IdentityVerificationModel.findOneAndUpdate(
      { user: userId },
      { $set: { user: userId, licenseNumber, stateOfIssue, expirationDate, licenseDocument } },
      { new: true, upsert: true }
    );

    ApiResponse.success(res, updated, 'Identity verification saved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to save identity verification', 500);
  }
};

export const getIdentity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const identity = await IdentityVerificationModel.findOne({ user: userId });
    ApiResponse.success(res, identity || {}, 'Identity verification fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch identity verification', 500);
  }
};

// 6. Bank Details
export const saveBankDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { bankName, accountType, accountNumber, routingNumber, accountHolderName } = req.body;

    const updated = await BankDetailsModel.findOneAndUpdate(
      { user: userId },
      { $set: { user: userId, bankName, accountType, accountNumber, routingNumber, accountHolderName } },
      { new: true, upsert: true }
    );

    ApiResponse.success(res, updated, 'Bank details saved successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to save bank details', 500);
  }
};

export const getBankDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const bank = await BankDetailsModel.findOne({ user: userId });
    ApiResponse.success(res, bank || {}, 'Bank details fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch bank details', 500);
  }
};

// 7. Dependents
export const createDependent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const payload = req.body;
    console.log("userId", userId)

    if (Array.isArray(payload)) {
      await DependentModel.deleteMany({ user: userId });
      const docs = payload.map((dep: any) => ({
        user: userId,
        name: dep.name || `${dep.firstName || ''} ${dep.lastName || ''}`.trim(),
        firstName: dep.firstName || dep.name || 'Dependent',
        lastName: dep.lastName || '',
        ssn: dep.ssn || '',
        dob: dep.dob || dep.dateOfBirth || '',
        relationship: dep.relationship || 'Child',
      }));
      const created = await DependentModel.insertMany(docs);
      ApiResponse.success(res, created, 'Dependents saved successfully', 201);
      return;
    }

    const created = await DependentModel.create({
      user: userId,
      name: payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
      firstName: payload.firstName || payload.name || 'Dependent',
      lastName: payload.lastName || '',
      ssn: payload.ssn || '',
      dob: payload.dob || payload.dateOfBirth || '',
      relationship: payload.relationship || 'Child',
    });

    ApiResponse.success(res, created, 'Dependent created successfully', 201);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to create dependent', 500);
  }
};

export const getDependents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const dependents = await DependentModel.find({ user: userId });
    ApiResponse.success(res, dependents, 'Dependents list fetched');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch dependents', 500);
  }
};

export const updateDependent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await DependentModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      ApiResponse.error(res, 'Dependent not found', 404);
      return;
    }
    ApiResponse.success(res, updated, 'Dependent updated successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to update dependent', 500);
  }
};

export const deleteDependent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await DependentModel.findByIdAndDelete(id);
    if (!deleted) {
      ApiResponse.error(res, 'Dependent not found', 404);
      return;
    }
    ApiResponse.success(res, deleted, 'Dependent deleted successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to delete dependent', 500);
  }
};
