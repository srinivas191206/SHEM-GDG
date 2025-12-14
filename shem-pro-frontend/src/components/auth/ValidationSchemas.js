import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone number (10 digits required)'),
});

export const householdSchema = z.object({
  householdSize: z.number().min(1, 'Household size is required').int('Must be a whole number'),
  houseType: z.enum(['apartment', 'house', 'condo'], { message: 'Please select a house type' }),
  energyProvider: z.string().min(1, 'Energy provider is required'),
});

export const deviceSetupSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  deviceLocation: z.string().min(1, 'Device location is required'),
});