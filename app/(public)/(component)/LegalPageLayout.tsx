import { ReactNode } from 'react';
import PageHero from './PageHero';

interface LegalPageLayoutProps {
    title: string;
    lastUpdated: string;
    intro?: string;
    children: ReactNode;
}

export default function LegalPageLayout({
    title,
    lastUpdated,
    intro,
    children,
}: LegalPageLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F5F5F3]">
            <PageHero
                imageSrc="/home_bg_photos/1.jpg"
                imageAlt={title}
                title={title}
                height="40vh"
                overlayOpacity={0.5}
            />

            <section className="max-w-3xl mx-auto px-6 py-16">
                <p className="text-sm text-[#292826] opacity-60 mb-2">
                    Last updated: {lastUpdated}
                </p>
                {intro && (
                    <p className="text-base text-[#292826] opacity-80 leading-relaxed mb-10">
                        {intro}
                    </p>
                )}

                <div className="space-y-10 text-[#292826] leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-2 [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-3 [&_p]:opacity-85 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:opacity-85 [&_a]:text-[#355872] [&_a]:underline">
                    {children}
                </div>
            </section>
        </div>
    );
}
