import ChildrenCard from '../(component)/ChildrenCard';
import PageHero from '../(component)/PageHero';
import Breadcrumbs from '../(component)/Breadcrumbs';
import { getAllChildren } from '@/lib/repositories/children.repository';

export default async function OurChildrenPage() {
  const children = await getAllChildren();

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
          {children.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">No children profiles available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {children.map((child) => (
                <ChildrenCard
                  key={child.id}
                  id={child.id}
                  name={child.name}
                  photo={child.photo_url || ""}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
