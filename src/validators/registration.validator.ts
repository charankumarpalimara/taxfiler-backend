import { z } from 'zod';

export const createRegistrationSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Valid phone number is required'),
    password: z.string().optional(),
    portalStatus: z.string().optional().default('Pending Review'),
    accountType: z.string().optional().default('Business Portal'),
  }),
});

export const updateRegistrationStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Registration ID is required'),
  }),
  body: z.object({
    portalStatus: z.string().min(1, 'Portal status is required'),
  }),
});
