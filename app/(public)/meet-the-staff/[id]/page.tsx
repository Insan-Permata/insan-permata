import { notFound } from 'next/navigation';
import Image from 'next/image';
import PageHero from '../../(component)/PageHero';
import Breadcrumbs from '../../(component)/Breadcrumbs';
import { staffMembers } from '@/data/staff';

interface StaffDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function StaffDetailPage({ params }: StaffDetailPageProps) {
    const { id } = await params;

    // Find the staff member
    const staff = staffMembers.find((member) => member.id === id);

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
                                    <Image
                                        src={staff.photoUrl}
                                        alt={staff.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        quality={85}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm">
                                <p className="text-lg text-foreground/80 leading-relaxed">
                                    {staff.description}
                                </p>
                            </div>

                            {/* Bible Verse */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm">
                                <blockquote className="border-l-4 border-brown pl-6 italic text-foreground/70 text-lg">
                                    {staff.bibleVerse}
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
