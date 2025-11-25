import Image from 'next/image';
import { notFound } from 'next/navigation';
import { children } from '@/data/children';
import PageHero from '../../(component)/PageHero';
import Breadcrumbs from '../../(component)/Breadcrumbs';

interface ChildDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ChildDetailPage({ params }: ChildDetailPageProps) {
    const { id } = await params;
    const child = children.find((c) => c.id === id);

    if (!child) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <PageHero
                imageSrc="/our_children_bg/1.png"
                imageAlt="Our Children Background"
                title={child.name}
                height="30vh"
                overlayOpacity={0.4}
            />

            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Our Children', href: '/our-children' },
                    { label: child.name, href: `/children/${child.id}` }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left Column: Photo */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src={child.photoUrl}
                                    alt={child.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            <h2 className="text-3xl font-bold text-foreground mb-6 border-b pb-4">
                                Hello, I'm {child.name}!
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                        Educational Stage
                                    </h3>
                                    <p className="text-xl text-foreground font-medium">
                                        {child.educationalStage}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                        About Me
                                    </h3>
                                    <p className="text-lg text-foreground/80 leading-relaxed">
                                        {child.aboutMe}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                        Interests
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {child.interests.map((interest, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-off-white text-foreground rounded-full text-sm font-medium"
                                            >
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                        Favorite Bible Verse
                                    </h3>
                                    <blockquote className="border-l-4 border-brown pl-4 italic text-foreground/80 text-lg my-2">
                                        "{child.favoriteBibleVerse}"
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
