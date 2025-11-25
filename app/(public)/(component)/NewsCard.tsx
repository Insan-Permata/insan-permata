import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface NewsCardProps {
    id: string;
    title: string;
    imageUrl: string;
    date: Date;
}

export default function NewsCard({ id, title, imageUrl, date }: NewsCardProps) {
    // Format date as "Month Year"
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <Link href={`/news/${id}`} className="block">
            <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={85}
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-brown transition-colors duration-300">
                        {title}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={date.toISOString()}>
                            {formattedDate}
                        </time>
                    </div>
                </div>
            </article>
        </Link>
    );
}
