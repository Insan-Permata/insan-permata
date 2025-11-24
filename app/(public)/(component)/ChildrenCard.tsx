import Image from 'next/image';

interface ChildrenCardProps {
  name: string;
  photo: string;
}

export default function ChildrenCard({ name, photo }: ChildrenCardProps) {
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 aspect-[3/4] w-full max-w-[200px] mx-auto cursor-pointer">
      {/* Photo as Background */}
      <div className="absolute inset-0 transition-all duration-300 group-hover:blur-md">
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          quality={75}
        />
      </div>
      
      {/* Gradient Blur Overlay at Bottom for Name */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-md bg-black/20 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
        }}
      />
      
      {/* Name - Hidden on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="text-lg font-semibold text-[#F5F5F3] text-center drop-shadow-lg">
          {name}
        </h3>
      </div>
      
      {/* More Info Text - Appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
        <p className="text-base font-medium text-[#F5F5F3] text-center drop-shadow-lg">
          Learn more about {name}
        </p>
      </div>
    </div>
  );
}

