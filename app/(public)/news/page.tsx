import PageHero from '../(component)/PageHero';
import Breadcrumbs from '../(component)/Breadcrumbs';
import NewsCard from '../(component)/NewsCard';
import { getAllNews } from '@/lib/repositories/news.repository';

export default async function NewsPage() {
  const newsItems = await getAllNews();

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
          {newsItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">No news articles available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((news) => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  title={news.title}
                  imageUrl={news.image_url || ""}
                  date={new Date(news.published_at)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
