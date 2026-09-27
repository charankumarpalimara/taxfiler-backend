export const PORTAL_STATUSES = {
  PENDING_REVIEW: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
} as const;

export const ACCOUNT_TYPES = {
  INDIVIDUAL: 'Individual Portal',
  BUSINESS: 'Business Portal',
  CORPORATE: 'Corporate Portal',
} as const;

export const SUBMISSION_STATUSES = {
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In Review',
  ACTION_REQUIRED: 'Action Required',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
} as const;
