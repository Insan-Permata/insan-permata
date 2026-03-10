import Link from "next/link";
import Image from "next/image";
import BackgroundCarousel from "./(component)/BackgroundCarousel";
import ImageCarousel from "./(component)/ImageCarousel";
import { getCarouselsByType } from '@/lib/repositories/carousels.repository';

export default async function Home() {
  // Fetch real carousel images from database
  const [backgroundCarousels, storyCarousels] = await Promise.all([
    getCarouselsByType('background'),
    getCarouselsByType('story')
  ]);

  const backgroundImages = backgroundCarousels.map(c => c.image_url);
  const storyImages = storyCarousels.map(c => c.image_url);

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen pt-0">
        {/* Background Carousel - Fixed behind header */}
        <BackgroundCarousel
          images={backgroundImages.length > 0 ? backgroundImages : ['/placeholder.jpg']}
          interval={5000}
          overlay={true}
          overlayOpacity={0.6}
        />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#F5F5F3] mb-6 max-w-4xl leading-tight drop-shadow-lg">
            A Home for God’s Treasured Children</h1>
          <p className="text-lg md:text-xl font-light text-[#F5F5F3] max-w-2xl leading-relaxed opacity-90 drop-shadow-md">
            Ephesians 2:10 -  "For we are God’s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
          </p>
          <Link
            href="/support"
            className="mt-8 inline-block px-8 py-3 border-2 border-[#F5F5F3] text-[#F5F5F3] font-semibold rounded-full hover:bg-[#355872] hover:text-[#F5F5F3] hover:border-[#355872] transition-all duration-300 drop-shadow-md"
          >
            Support Our Mission
          </Link>
        </div>
      </div>

      {/* Our Story & Mission Section */}
      <section className="bg-[#F5F5F3] py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#292826]">
                Our Story & Mission
              </h2>
              <p className="text-base md:text-lg text-[#292826] leading-relaxed">
                For over 20 years, Insan Permata has been more than just a shelter; it has been a sanctuary where every child is seen as a divine masterpiece. Guided by our faith, we provide a loving and stable environment where children can heal, grow, and discover the "good works" God has prepared for them.
              </p>
              <p className="text-base md:text-lg text-[#292826] leading-relaxed">
                We are committed to empowering these young lives to become compassionate leaders who will shape the future of Indonesia with purpose and hope.
              </p>
            </div>

            {/* Right Side - Image Carousel */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="/indonesia map.png"
                alt="Indonesia Map"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}