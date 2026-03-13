"use client";

interface LogoCarouselProps {
  logos: { name: string }[];
  speed?: number;
}

export function LogoCarousel({ logos, speed = 30 }: LogoCarouselProps) {
  const doubled = [...logos, ...logos];
  return (
    <div className="overflow-hidden">
      <div
        className="flex items-center gap-16 whitespace-nowrap"
        style={{ animation: `scroll-left ${speed}s linear infinite` }}
      >
        {doubled.map((logo, i) => (
          <span
            key={i}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 text-lg font-semibold tracking-wider select-none"
          >
            {logo.name}
          </span>
        ))}
      </div>
    </div>
  );
}
