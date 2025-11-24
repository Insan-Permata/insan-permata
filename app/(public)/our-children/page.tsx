import ChildrenCard from '../(component)/ChildrenCard';
import PageHero from '../(component)/PageHero';

export default function OurChildrenPage() {
  // Placeholder data - Replace with real data later
  const children = [
    { name: 'Ahmad', photo: '/home_story_and_mission_photos/1.jpg' },
    { name: 'Siti', photo: '/home_story_and_mission_photos/2.jpg' },
    { name: 'Budi', photo: '/home_story_and_mission_photos/3.jpg' },
    { name: 'Dewi', photo: '/home_story_and_mission_photos/4.jpg' },
    { name: 'Rizki', photo: '/home_story_and_mission_photos/5.jpg' },
    { name: 'Lina', photo: '/home_story_and_mission_photos/6.jpg' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Hero Section */}
      <PageHero
        imageSrc="/our_children_bg/1.png"
        imageAlt="Our Children Background"
        title="Our Children"
        height="30vh"
        overlayOpacity={0.4}
      />

      {/* Children Cards Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {children.map((child, index) => (
              <ChildrenCard
                key={index}
                name={child.name}
                photo={child.photo}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

