import { NEWS_ITEMS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import Badge from '@/components/ui/Badge';

export default function News() {
  return (
    <section id="news" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="News & Updates"
          subtitle="Stay informed about our latest projects, partnerships, and industry insights."
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS_ITEMS.map((item) => (
            <Card key={item.id} hover padding="sm" className="group overflow-hidden">
              {/* Image placeholder */}
              <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 to-primary-200">
                <div className="absolute inset-0 flex items-center justify-center text-primary-400">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              </div>

              <div className="px-2 pb-2">
                <Badge variant="info">{formatDate(item.date)}</Badge>
                <h3 className="mt-3 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-500">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
