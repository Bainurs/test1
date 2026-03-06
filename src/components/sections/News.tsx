import { getPublishedNews } from '@/services/newsService';
import SectionHeading from '@/components/ui/SectionHeading';
import NewsSlider from '@/components/sections/NewsSlider';

export default async function News() {
  const articles = await getPublishedNews(10);

  const serialized = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    description: a.description,
    imageUrl: a.imageUrl,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <section id="news" className="bg-neutral-200 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="News & Updates"
          subtitle="Stay informed about our latest projects, partnerships, and industry insights."
        />

        {serialized.length === 0 ? (
          <p className="text-center text-neutral-500">
            No news articles published yet. Check back soon for updates.
          </p>
        ) : (
          <NewsSlider articles={serialized} />
        )}
      </div>
    </section>
  );
}
