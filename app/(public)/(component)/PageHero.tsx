import Image from 'next/image';

interface PageHeroProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  height?: string;
  overlayOpacity?: number;
}

export default function PageHero({
  imageSrc,
  imageAlt,
  title,
  height = '50vh',
  overlayOpacity = 0.4,
}: PageHeroProps) {
  return (
    <section className="relative w-full" style={{ height }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
      </div>
      
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Title */}
      <div className="relative h-full flex items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#F5F5F3] drop-shadow-lg">
          {title}
        </h1>
      </div>
    </section>
  );
}

