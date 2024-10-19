import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";

interface CarouselItemProps {
  isActive?: boolean;
  children: ReactNode;
}

interface VerticalCarouselProps {
  children: ReactElement<CarouselItemProps>[];
}

export function VerticalCarousel({ children }: VerticalCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (index: number): void => {
    if (containerRef.current && containerRef.current.children[index]) {
      (containerRef.current.children[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = (): void => {
    if (containerRef.current) {
      const scrollPosition = containerRef.current.scrollTop;
      const sectionHeight = containerRef.current.clientHeight;
      const newIndex = Math.round(scrollPosition / sectionHeight);
      setActiveIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

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
              ? React.cloneElement(child, { isActive: index === activeIndex })
              : child}
          </div>
        ))}
      </div>

      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6">
        {React.Children.map(children, (_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full ${
              index === activeIndex ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => scrollToSection(index)}
          />
        ))}
      </div>
    </div>
  );
}
