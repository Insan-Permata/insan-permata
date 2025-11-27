import { notFound } from 'next/navigation';
import Image from 'next/image';
import PageHero from '../../(component)/PageHero';
import Breadcrumbs from '../../(component)/Breadcrumbs';
import { getStaffById } from '@/lib/repositories/staff.repository';

interface StaffDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function StaffDetailPage({ params }: StaffDetailPageProps) {
    const { id } = await params;
    const staff = await getStaffById(id);

    if (!staff) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <PageHero
                imageSrc="/home_story_and_mission_photos/4.jpg"
                imageAlt={staff.name}
                title={staff.name}
                height="30vh"
                overlayOpacity={0.5}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Meet the Staff', href: '/meet-the-staff' },
                    { label: staff.name, href: `/meet-the-staff/${staff.id}` },
                ]}
            />

            {/* Staff Details */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Left Column: Photo */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                                    {staff.photo_url ? (
                                        <Image
                                            src={staff.photo_url}
                                            alt={staff.name}
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
                                <h2 className="text-3xl font-bold text-foreground mb-6 border-b pb-4">
                                    {staff.name}
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                            Role
                                        </h3>
                                        <p className="text-xl text-foreground font-medium">
                                            {staff.role}
                                        </p>
                                    </div>

                                    {staff.description && (
                                        <div>
                                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                                About
                                            </h3>
                                            <p className="text-lg text-foreground/80 leading-relaxed">
                                                {staff.description}
                                            </p>
                                        </div>
                                    )}

                                    {staff.bible_verse && (
                                        <div>
                                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                                                Favorite Bible Verse
                                            </h3>
                                            <blockquote className="border-l-4 border-brown pl-4 italic text-foreground/80 text-lg my-2">
                                                "{staff.bible_verse}"
                                            </blockquote>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
