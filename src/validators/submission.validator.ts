import { z } from 'zod';

export const createSubmissionSchema = z.object({
  body: z.object({
    serviceType: z.string().min(1, 'Service Type is required'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().optional(),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Valid phone number is required'),
    details: z.record(z.string(), z.any()).optional().default({}),
  }),
});

export const updateSubmissionStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Submission ID is required'),
  }),
  body: z.object({
    status: z.string().min(1, 'Status is required'),
  }),
});
