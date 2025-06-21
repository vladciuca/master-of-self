"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PageLogo } from "@components/PageLogo";

interface PageCarouselProps {
  images?: string[];
  autoPlayInterval?: number;
  showDots?: boolean;
}

export function PageCarousel({
  images = [],
  autoPlayInterval = 5000,
  showDots = true,
}: PageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Total slides = PageLogo + custom images
  const totalSlides = 1 + images.length;

  // Auto-play functionality
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [totalSlides, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // If no images provided, just show PageLogo
  if (images.length === 0) {
    return <PageLogo />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-transparent">
      {/* Slides Container - Updated for fade transitions */}
      <div className="relative h-full w-full">
        {/* First slide - PageLogo */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
            currentSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <PageLogo />
        </div>

        {/* Custom image slides */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-700 ease-in-out ${
              currentSlide === index + 1 ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Slide ${index + 2}`}
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
              fill
              sizes="(max-width: 400px) 100vw, 400px"
              // className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {/* {showDots && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-primary w-6"
                  : "bg-muted hover:bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}
