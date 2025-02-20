import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";
import { useDebounce } from "@hooks/useDebounce";

interface CarouselItemProps {
  isActive?: boolean;
  children: ReactNode;
}

interface VerticalCarouselProps {
  isDrawerOpen: boolean;
  children: ReactElement<CarouselItemProps>[];
}

export function VerticalCarousel({
  isDrawerOpen,
  children,
}: VerticalCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const debouncedScrollPosition = useDebounce(scrollPosition, 10);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = (index: number): void => {
    if (containerRef.current && containerRef.current.children[index]) {
      isScrollingRef.current = true;
      setActiveIndex(index); // Set active index immediately on click
      (containerRef.current.children[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // // Clear the scrolling flag after the scroll animation is likely to be complete
      // setTimeout(() => {
      //   isScrollingRef.current = false;
      // }, 1000); // Adjust this timeout if needed
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout and store the reference
      timeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000); // Adjust this timeout if needed
    }
  };

  const handleScroll = (): void => {
    if (containerRef.current && !isScrollingRef.current) {
      setScrollPosition(containerRef.current.scrollTop);
    }
  };

  useEffect(() => {
    if (containerRef.current && !isScrollingRef.current) {
      const sectionHeight = containerRef.current.clientHeight;
      const newIndex = Math.round(debouncedScrollPosition / sectionHeight);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  }, [debouncedScrollPosition, activeIndex]);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container) {
  //     container.addEventListener("scroll", handleScroll);
  //     return () => {
  //       container.removeEventListener("scroll", handleScroll);
  //     };
  //   }
  // }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
        // Clear the timeout when the component unmounts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [handleScroll]);

  return (
    <div className="relative h-screen overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className="h-screen snap-start">
            {React.isValidElement(child)
              ? React.cloneElement(child, {
                  isActive: isDrawerOpen && index === activeIndex,
                })
              : child}
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2 flex justify-center items-center space-x-6">
        {React.Children.map(children, (_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === activeIndex ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>
    </div>
  );
}
