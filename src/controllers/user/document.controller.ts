import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { DocumentUploadModel } from '../../models/documentUpload.model.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { documentType, person } = req.body;

    if (!req.file && !req.body.fileUrl) {
      ApiResponse.error(res, 'No file uploaded', 400);
      return;
    }

    const fileName = req.file ? req.file.originalname : req.body.fileName || 'Uploaded_Document.pdf';
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl;
    const fileSize = req.file ? req.file.size : req.body.fileSize || 0;

    const doc = await DocumentUploadModel.create({
      userId,
      documentType: documentType || 'Others',
      person: person || 'Tax Payer',
      fileName,
      fileUrl,
      fileSize,
    });

    ApiResponse.success(res, doc, 'Document uploaded successfully', 201);
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to upload document', 500);
  }
};

export const listDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const documents = await DocumentUploadModel.find({ userId }).sort({ createdAt: -1 });
    ApiResponse.success(res, documents, 'Documents fetched successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to fetch documents', 500);
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await DocumentUploadModel.findByIdAndDelete(id);
    if (!deleted) {
      ApiResponse.error(res, 'Document not found', 404);
      return;
    }
    ApiResponse.success(res, deleted, 'Document deleted successfully');
  } catch (error: any) {
    ApiResponse.error(res, error.message || 'Failed to delete document', 500);
  }
};
