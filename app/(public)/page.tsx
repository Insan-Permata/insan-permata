"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/home_bg_photos/1.jpg',
    '/home_bg_photos/2.jpg',
    '/home_bg_photos/3.jpg',
    '/home_bg_photos/4.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Carousel - Covers entire viewport including header */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Background ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
              quality={75}
            />
          </div>
        ))}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

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