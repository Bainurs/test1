import { prisma } from '@/lib/prisma';
import type { NewsArticle } from '@prisma/client';

export interface CreateNewsInput {
  title: string;
  description: string;
  imageUrl?: string;
  published?: boolean;
}

export interface UpdateNewsInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  published?: boolean;
}

/** Generate a URL-safe slug from a title */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 120)
    .replace(/^-|-$/g, '');
}

/** Ensure slug uniqueness by appending a counter if needed */
async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let counter = 1;

  while (true) {
    const existing = await prisma.newsArticle.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${slug}-${counter}`;
    counter++;
  }
}

/** Create a new news article */
export async function createNews(data: CreateNewsInput): Promise<NewsArticle> {
  const slug = await ensureUniqueSlug(generateSlug(data.title));

  return prisma.newsArticle.create({
    data: {
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      imageUrl: data.imageUrl?.trim() || null,
      published: data.published ?? false,
    },
  });
}

/** Update a news article */
export async function updateNews(id: string, data: UpdateNewsInput): Promise<NewsArticle> {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) {
    updateData.title = data.title.trim();
    updateData.slug = await ensureUniqueSlug(generateSlug(data.title), id);
  }
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl?.trim() || null;
  if (data.published !== undefined) updateData.published = data.published;

  return prisma.newsArticle.update({
    where: { id },
    data: updateData,
  });
}

/** Delete a news article */
export async function deleteNews(id: string): Promise<void> {
  await prisma.newsArticle.delete({ where: { id } });
}

/** Get a single news article by ID */
export async function getNewsById(id: string): Promise<NewsArticle | null> {
  return prisma.newsArticle.findUnique({ where: { id } });
}

/** Get a single news article by slug (public) */
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  return prisma.newsArticle.findUnique({ where: { slug } });
}

/** Get all news articles (admin — includes drafts) */
export async function getAllNews(): Promise<NewsArticle[]> {
  return prisma.newsArticle.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/** Get published news articles (public) */
export async function getPublishedNews(limit?: number): Promise<NewsArticle[]> {
  return prisma.newsArticle.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/** Get total count of published news */
export async function getPublishedNewsCount(): Promise<number> {
  return prisma.newsArticle.count({ where: { published: true } });
}
