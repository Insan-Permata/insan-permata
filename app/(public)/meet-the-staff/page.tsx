import PageHero from '../(component)/PageHero';
import Breadcrumbs from '../(component)/Breadcrumbs';
import StaffCard from '../(component)/StaffCard';
import { getAllStaff } from '@/lib/repositories/staff.repository';

export default async function MeetTheStaffPage() {
  const staffMembers = await getAllStaff();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        imageSrc="/home_story_and_mission_photos/4.jpg"
        imageAlt="Meet the Staff Background"
        title="Meet the Staff"
        height="30vh"
        overlayOpacity={0.4}
      />

      <Breadcrumbs />

      {/* Staff Cards Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {staffMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">No staff members available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {staffMembers.map((staff) => (
                <StaffCard
                  key={staff.id}
                  id={staff.id}
                  name={staff.name}
                  photo={staff.photo_url || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}