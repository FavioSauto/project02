import { z } from 'zod';

export const createHouseholdSchema = z.object({
  name: z.string().min(1, 'Household name is required').max(50),
});

export const updateHouseholdSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Household name is required').max(50),
});

export const updateMemberRoleSchema = z.object({
  householdId: z.string().uuid(),
  memberId: z.string().uuid(),
  role: z.enum(['admin', 'member']),
});

export const addMemberSchema = z.object({
  householdId: z.string().uuid(),
  email: z.string().email('Invalid email address'),
});
