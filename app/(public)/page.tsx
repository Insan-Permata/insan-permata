import BackgroundCarousel from "./(component)/BackgroundCarousel";

export default function Home() {
  const backgroundImages = [
    '/home_bg_photos/1.jpg',
    '/home_bg_photos/2.jpg',
    '/home_bg_photos/3.jpg',
    '/home_bg_photos/4.jpg',
  ];

  return (
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
  );
}