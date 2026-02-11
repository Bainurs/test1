import { prisma } from '@/lib/prisma';
import type { ContactSubmission } from '@prisma/client';

export interface CreateContactInput {
  name: string;
  phone: string;
  email: string;
  requestType: string;
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ContactListResult {
  submissions: ContactSubmission[];
  total: number;
  page: number;
  totalPages: number;
}

/** Create a new contact submission */
export async function createContact(data: CreateContactInput): Promise<ContactSubmission> {
  return prisma.contactSubmission.create({
    data: {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      requestType: data.requestType,
    },
  });
}

/** Get paginated contact submissions with optional search */
export async function getContacts(params: ContactListParams = {}): Promise<ContactListResult> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const skip = (page - 1) * limit;

  const where = params.search
    ? {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' as const } },
          { email: { contains: params.search, mode: 'insensitive' as const } },
          { phone: { contains: params.search } },
        ],
      }
    : {};

  const [submissions, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return {
    submissions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/** Get total count of contact submissions */
export async function getContactCount(): Promise<number> {
  return prisma.contactSubmission.count();
}
