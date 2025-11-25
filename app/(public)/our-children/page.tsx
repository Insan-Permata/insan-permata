import ChildrenCard from '../(component)/ChildrenCard';
import PageHero from '../(component)/PageHero';
import Breadcrumbs from '../(component)/Breadcrumbs';
import { children } from '@/data/children';

export default function OurChildrenPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHero
        imageSrc="/our_children_bg/1.png"
        imageAlt="Our Children Background"
        title="Our Children"
        height="30vh"
        overlayOpacity={0.4}
      />

      <Breadcrumbs />

      {/* Children Cards Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {children.map((child) => (
              <ChildrenCard
                key={child.id}
                id={child.id}
                name={child.name}
                photo={child.photoUrl}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
