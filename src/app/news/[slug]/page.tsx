import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getNewsBySlug, getPublishedNews } from '@/services/newsService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PageProps {
  params: { slug: string };
}

/** Dynamic metadata for SEO */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug);
  if (!article || !article.published) return {};

  return {
    title: article.title,
    description: article.description.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.description.substring(0, 160),
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const article = await getNewsBySlug(params.slug);

  if (!article || !article.published) {
    notFound();
  }

  const publishedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-200 pt-24">
        {/* Article header */}
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/#news"
            className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-700"
          >
            &larr; Back to Home
          </Link>

          {/* Date */}
          <p className="mt-6 text-sm font-medium text-neutral-500">
            {publishedDate}
          </p>

          {/* Title */}
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {/* Featured image */}
          {article.imageUrl && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="mt-10 pb-20">
            <div className="prose prose-lg max-w-none text-neutral-800 leading-relaxed whitespace-pre-line">
              {article.description}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
