"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  className?: string;
}

export default function ImageCarousel({ 
  images, 
  interval = 5000,
  className = ""
}: ImageCarouselProps) {
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
    <div className={`relative w-full h-full ${className}`}>
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={75}
          />
        </div>
      ))}
    </div>
  );
}

