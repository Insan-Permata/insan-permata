import PageHero from '../(component)/PageHero';
import Breadcrumbs from '../(component)/Breadcrumbs';
import StaffCard from '../(component)/StaffCard';
import { staffMembers } from '@/data/staff';

export default function MeetTheStaffPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {staffMembers.map((staff) => (
              <StaffCard
                key={staff.id}
                id={staff.id}
                name={staff.name}
                photo={staff.photoUrl}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}