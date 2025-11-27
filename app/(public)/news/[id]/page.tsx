import { notFound } from 'next/navigation';
import PageHero from '../../(component)/PageHero';
import Breadcrumbs from '../../(component)/Breadcrumbs';
import { getNewsById } from '@/lib/repositories/news.repository';
import { Calendar, User } from 'lucide-react';

interface NewsDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { id } = await params;
    const newsItem = await getNewsById(id);

    if (!newsItem) {
        notFound();
    }

    // Format date
    const formattedDate = new Date(newsItem.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <PageHero
                imageSrc={newsItem.image_url || '/news_bg_photos/2.jpg'}
                imageAlt={newsItem.title}
                title={newsItem.title}
                height="40vh"
                overlayOpacity={0.5}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'News', href: '/news' },
                    { label: newsItem.title, href: `/news/${newsItem.id}` },
                ]}
            />

            {/* Article Content */}
            <article className="py-12 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-foreground/70">
                            <User className="w-5 h-5" />
                            <span className="font-medium">{newsItem.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70">
                            <Calendar className="w-5 h-5" />
                            <time dateTime={newsItem.published_at}>
                                {formattedDate}
                            </time>
                        </div>
                    </div>

                    {/* Excerpt */}
                    {newsItem.excerpt && (
                        <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-brown">
                            <p className="text-lg text-foreground/80 italic">
                                {newsItem.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Article Body */}
                    <div
                        className="prose prose-lg max-w-none
              prose-headings:text-foreground prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
              prose-ul:my-6 prose-li:text-foreground/80 prose-li:mb-2
              prose-strong:text-foreground prose-strong:font-semibold
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:w-full"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {newsItem.content}
                    </div>
                </div>
            </article>
        </div>
    );
}
