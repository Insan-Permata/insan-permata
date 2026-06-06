import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getChildById } from '@/lib/repositories/children.repository';
import PageHero from '../../(component)/PageHero';
import Breadcrumbs from '../../(component)/Breadcrumbs';

interface ChildDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ChildDetailPage({ params }: ChildDetailPageProps) {
    const { id } = await params;
    const child = await getChildById(id);

    if (!child) {
        notFound();
    }

    // Format educational stage for display
    const formatEducationalStage = (stage: string | null) => {
        if (!stage || stage === '-') return 'Not specified';
        return stage.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Calculate age from date of birth
    const calculateAge = (dob: string | null) => {
        if (!dob) return null;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getAgeGroup = (age: number | null) => {
        if (age === null) return null;
        if (age < 4) return 'Toddler (Under 4)';
        if (age <= 7) return 'Early Childhood (4–7)';
        if (age <= 11) return 'Children (8–11)';
        if (age <= 15) return 'Early Teens (12–15)';
        if (age <= 19) return 'Late Teens (16–19)';
        return null;
    };

    const getYouTubeEmbedUrl = (url: string): string | null => {
        try {
            const u = new URL(url);
            let videoId: string | null = null;
            if (u.hostname === 'youtu.be') {
                videoId = u.pathname.slice(1).split('?')[0];
            } else if (u.hostname.includes('youtube.com')) {
                if (u.pathname === '/watch') {
                    videoId = u.searchParams.get('v');
                } else if (u.pathname.startsWith('/embed/')) {
                    videoId = u.pathname.split('/embed/')[1].split('?')[0];
                }
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch {
            return null;
        }
    };

    const age = calculateAge(child.date_of_birth);
    const ageGroup = getAgeGroup(age);
    const firstName = child.name.split(' ')[0];
    const embedUrl = child.youtube_url ? getYouTubeEmbedUrl(child.youtube_url) : null;

    return (
        <div className="min-h-screen bg-background">
            <PageHero
                imageSrc="/our_children_bg/1.png"
                imageAlt="Our Children Background"
                title={firstName}
                height="30vh"
                overlayOpacity={0.4}
            />

            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Our Children', href: '/our-children' },
                    { label: firstName, href: `/our-children/${child.id}` }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left Column: Photo */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24">
                            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl">
                                {child.photo_url ? (
                                    <Image
                                        src={child.photo_url || ""}
                                        alt={child.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No photo available</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            <h2 className="text-3xl font-normal tracking-tight text-foreground mb-6 border-b pb-4">
                                Hello, I&apos;m {firstName}!
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                        Educational Stage
                                    </h3>
                                    <p className="text-xl text-foreground font-medium">
                                        {formatEducationalStage(child.educational_stage)}
                                    </p>
                                </div>

                                {ageGroup && (
                                    <div>
                                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                            Age Group
                                        </h3>
                                        <p className="text-xl text-foreground font-medium">
                                            {ageGroup}
                                        </p>
                                    </div>
                                )}

                                {child.story && (
                                    <div>
                                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                            About Me
                                        </h3>
                                        <p className="text-lg text-foreground/80 leading-relaxed">
                                            {child.story}
                                        </p>
                                    </div>
                                )}

                                {child.interests && child.interests.length > 0 && (
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
                                )}

                                {child.bible_verse && (
                                    <div>
                                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                            Favorite Bible Verse
                                        </h3>
                                        <blockquote className="border-l-4 border-brown pl-4 italic text-foreground/80 text-lg my-2">
                                            {child.bible_verse}
                                        </blockquote>
                                    </div>
                                )}

                                {embedUrl && (
                                    <div>
                                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">
                                            Video
                                        </h3>
                                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                            <iframe
                                                className="absolute top-0 left-0 w-full h-full rounded-xl"
                                                src={embedUrl}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Last updated note */}
            {child.updated_at && (
                <p className="text-center text-xs text-foreground/40 pb-10">
                    Last updated {new Date(child.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </p>
            )}
        </div>
    );
}
