import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ChildrenCardProps {
  id: string;
  name: string;
  photo: string;
}

export default function ChildrenCard({ id, name, photo }: ChildrenCardProps) {
  return (
    <Link
      href={`/our-children/${id}`}
      className="group relative block w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1"
    >
      {/* Background Image with Zoom Effect */}
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          quality={85}
        />
      </div>



      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
              {name}
            </h3>
            <div className="h-1 w-12 bg-brown rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
          </div>

          <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
