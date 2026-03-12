'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/utils/helpers';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

interface NewsSliderProps {
  articles: Article[];
}

export default function NewsSlider({ articles }: NewsSliderProps) {
  return (
    <div className="news-slider relative px-0 lg:px-14">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        grabCursor
        touchEventsTarget="container"
        navigation={{
          prevEl: '.news-slider .slider-prev',
          nextEl: '.news-slider .slider-next',
        }}
        pagination={{ clickable: true, el: '.news-slider .slider-dots' }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id}>
            <Link href={`/news/${article.slug}`} className="block h-full">
              <Card hover padding="sm" className="group h-full overflow-hidden">
                {/* Image */}
                <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 to-primary-200">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-primary-400">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="px-2 pb-2">
                  <Badge variant="info">{formatDate(article.createdAt)}</Badge>
                  <h3 className="mt-3 line-clamp-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-500">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-700">
                    {article.description}
                  </p>
                </div>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* External nav arrows — desktop only */}
      <button className="slider-prev absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-soft transition-all hover:bg-primary-500 hover:text-white lg:flex" aria-label="Previous slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button className="slider-next absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-soft transition-all hover:bg-primary-500 hover:text-white lg:flex" aria-label="Next slide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>

      {/* Pagination dots */}
      <div className="slider-dots mt-8 flex justify-center gap-2" />
    </div>
  );
}
