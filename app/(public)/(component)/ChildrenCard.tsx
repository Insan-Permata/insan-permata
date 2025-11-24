import Image from 'next/image';

interface ChildrenCardProps {
  name: string;
  photo: string;
}

export default function ChildrenCard({ name, photo }: ChildrenCardProps) {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 aspect-[3/4] w-full max-w-[200px] mx-auto">
      {/* Photo as Background */}
      <Image
        src={photo}
        alt={name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        quality={75}
      />
      
      {/* Gradient Blur Overlay at Bottom for Name */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-md bg-black/20"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
        }}
      />
      
      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-lg font-semibold text-[#F5F5F3] text-center drop-shadow-lg">
          {name}
        </h3>
      </div>
    </div>
  );
}

