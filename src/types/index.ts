export type SubmissionStatus = 'New' | 'In Progress' | 'Contacted' | 'Completed' | 'Archived';
export type PortalStatus = 'Verified' | 'Active' | 'Pending Review' | 'Suspended';

export interface Submission {
  id: string;
  type?: 'consultation' | 'quick_contact';
  firstName?: string;
  lastName?: string;
  clientName: string;
  email: string;
  phone: string;
  preferredLanguage?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  services: string[];
  leadSource?: string;
  notes?: string;
  staffNote?: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Registration {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone: string;
  portalStatus: PortalStatus;
  password: string;
  accountType: string;
  createdAt: string;
  lastLogin?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'user' | 'client';
  portalStatus?: PortalStatus;
  accountType?: string;
  createdAt: string;
  lastLogin?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  pagination?: PaginationMeta;
  error?: string;
}
