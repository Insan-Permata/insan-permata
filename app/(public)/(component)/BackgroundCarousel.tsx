"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundCarouselProps {
  images: string[];
  interval?: number;
  overlay?: boolean;
  overlayOpacity?: number;
}

export default function BackgroundCarousel({ 
  images, 
  interval = 5000,
  overlay = true,
  overlayOpacity = 0.4
}: BackgroundCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 w-full h-full">
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
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

