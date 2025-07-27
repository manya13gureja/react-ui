'use client';

import { useEffect, useRef, useState } from 'react';

type Section = {
  id: string;
  imageSrc: string;
};

export function ScrollPreview({ sections }: { sections: Section[] }) {
  const [hovering, setHovering] = useState(false);
  const [previewY, setPreviewY] = useState(0);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [hasPreview, setHasPreview] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!trackRef.current) return;

      setPreviewY(e.clientY);
      const scrollPosition = window.scrollY + e.clientY;

      const closestSection = sections.reduce((prev, curr) => {
        const elem = document.getElementById(curr.id);
        if (!elem) return prev;

        const offset = elem.offsetTop;
        const prevElem = document.getElementById(prev.id);
        const prevOffset = prevElem ? prevElem.offsetTop : 0;

        return Math.abs(offset - scrollPosition) < Math.abs(prevOffset - scrollPosition)
          ? curr
          : prev;
      }, sections[0]);

      if (
        closestSection &&
        typeof closestSection.imageSrc === 'string' &&
        closestSection.imageSrc.trim() !== ''
      ) {
        setCurrentImage(closestSection.imageSrc);
        setHasPreview(true);
      } else {
        setCurrentImage(null);
        setHasPreview(false);
      }
    }

    if (hovering) {
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hovering, sections]);

  return (
    <>
      {/* Hover trigger zone */}
      <div
        ref={trackRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          setCurrentImage(null);
          setHasPreview(false);
        }}
        className="fixed right-0 top-0 h-full z-50 w-3 sm:w-4 md:w-6 lg:w-8 xl:w-10 transition-all duration-200 ease-in-out"
      />

      {/* Floating preview box */}
      {hovering && (
        <div
          className="fixed right-6 z-[9999] w-40 h-24 bg-white border rounded-lg shadow-lg overflow-hidden transition flex items-center justify-center text-xs text-gray-500"
          style={{ top: previewY - 48 }}
        >
          {hasPreview && currentImage ? (
            <img
              src={currentImage}
              alt="Section preview"
              onError={() => {
                setHasPreview(false);
                setCurrentImage(null);
              }}
              className="object-cover w-full h-full"
            />
          ) : (
            <span>No preview</span>
          )}
        </div>
      )}
    </>
  );
}
