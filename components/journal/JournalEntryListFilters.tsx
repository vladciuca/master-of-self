"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

interface FilterButtonsProps {
  options: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function JournalEntryListFilters({
  options,
  activeFilter,
  onFilterChange,
}: FilterButtonsProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -100 : 100,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", handleScroll);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]); // Added handleScroll to dependencies

  const handleFilterChange = (filter: string) => {
    onFilterChange(filter);

    // Scroll the clicked button into view
    const buttonElement = buttonRefs.current[filter];
    if (buttonElement && scrollContainerRef.current) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const buttonRect = buttonElement.getBoundingClientRect();

      const isPartiallyHidden =
        buttonRect.left < containerRect.left + 40 || // Add some padding for the left arrow
        buttonRect.right > containerRect.right - 40; // Add some padding for the right arrow

      if (isPartiallyHidden) {
        buttonElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  return (
    <div className="relative w-full mb-4 px-1">
      {showLeftArrow && (
        <Button
          variant="secondary"
          size="lg"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hover:bg-secondary w-8 p-0 py-6 rounded-tr-none rounded-br-none"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide space-x-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {options.map((option) => (
          <Button
            key={option}
            ref={(el: HTMLButtonElement | null) => {
              if (el) buttonRefs.current[option] = el;
            }}
            size="sm"
            variant={activeFilter === option ? "default" : "outline"}
            onClick={() => handleFilterChange(option)}
            className="flex-shrink-0 text-xs rounded-full"
          >
            {option}
          </Button>
        ))}
      </div>
      {showRightArrow && (
        <Button
          variant="secondary"
          size="lg"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hover:bg-secondary w-8 p-0 py-6 rounded-tl-none rounded-bl-none"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
