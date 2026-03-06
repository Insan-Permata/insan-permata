"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface BackgroundCarouselProps {
  images: string[];
  interval?: number;
  overlay?: boolean;
  overlayOpacity?: number;
  /** Parallax travel factor (0 = no movement, 1 = full scroll speed). Default 0.35 */
  parallaxFactor?: number;
}

export default function BackgroundCarousel({
  images,
  interval = 5000,
  overlay = true,
  overlayOpacity = 0.4,
  parallaxFactor = 0.35,
}: BackgroundCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  // Carousel auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !imageWrapperRef.current) return;
      const scrolled = window.scrollY;
      const offset = scrolled * parallaxFactor;
      imageWrapperRef.current.style.transform = `scale(1.15) translateY(${offset}px)`;
    };

    // Set initial transform
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallaxFactor]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Image wrapper — slightly scaled up to give parallax room */}
      <div
        ref={imageWrapperRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: 'scale(1.15) translateY(0px)' }}
      >
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
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
      </div>

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
