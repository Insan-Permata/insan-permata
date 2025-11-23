import BackgroundCarousel from "./(component)/BackgroundCarousel";
import ImageCarousel from "./(component)/ImageCarousel";

export default function Home() {
  const backgroundImages = [
    '/home_bg_photos/1.jpg',
    '/home_bg_photos/2.jpg',
    '/home_bg_photos/3.jpg',
    '/home_bg_photos/4.jpg',
  ];

  const storyImages = [
    '/home_story_and_mission_photos/1.jpg',
    '/home_story_and_mission_photos/2.jpg',
    '/home_story_and_mission_photos/3.jpg',
    '/home_story_and_mission_photos/4.jpg',
    '/home_story_and_mission_photos/5.jpg',
    '/home_story_and_mission_photos/6.jpg',
  ];

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen">
        {/* Background Carousel */}
        <BackgroundCarousel 
          images={backgroundImages}
          interval={5000}
          overlay={true}
          overlayOpacity={0.4}
        />

        {/* Hero Content */}
        <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#F5F5F3] mb-6 max-w-4xl leading-tight drop-shadow-lg">
            Lorem ipsum dolor sit amet consectetur adipiscing elit
          </h1>
          <p className="text-lg md:text-xl font-light text-[#F5F5F3] max-w-2xl leading-relaxed opacity-90 drop-shadow-md">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-base md:text-lg text-[#292826] leading-relaxed">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
            </div>

            {/* Right Side - Image Carousel */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <ImageCarousel 
                images={storyImages}
                interval={5000}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}