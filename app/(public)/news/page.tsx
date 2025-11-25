import PageHero from '../(component)/PageHero';
import Breadcrumbs from '../(component)/Breadcrumbs';
import NewsCard from '../(component)/NewsCard';
import { newsItems } from '@/data/news';

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        imageSrc="/news_bg_photos/2.jpg"
        imageAlt="News Background"
        title="News"
        height="30vh"
        overlayOpacity={0.4}
      />

      <Breadcrumbs />

      {/* News Cards Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <NewsCard
                key={news.id}
                id={news.id}
                title={news.title}
                imageUrl={news.imageUrl}
                date={news.date}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
