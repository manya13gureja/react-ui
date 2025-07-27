'use client';

import { useEffect, useRef, useState } from 'react';

type ClickAndPasteProps = {
  width?: number;
  height?: number;
};

export function ClickAndPaste({ width = 200, height = 200 }: ClickAndPasteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragImage, setDragImage] = useState<string | null>(null);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragImageRef = useRef<HTMLImageElement | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const dragImageSrc = '/clickandpaste/copy.JPG';

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const floatingImg = dragImageRef.current;
      if (!floatingImg) return;

      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        floatingImg.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 10}px) scale(0.6)`;
      });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isDragging && dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIsDragging(false);
        setDragImage(null);
        setStartAnimation(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      document.body.addEventListener('click', handleClickOutside, true);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('click', handleClickOutside, true);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging]);

  const animateToCursor = (imgRect: DOMRect, cursorX: number, cursorY: number) => {
    const floatingImg = dragImageRef.current;
    if (!floatingImg) return;

    // Start from original position
    floatingImg.style.transition = 'none';
    floatingImg.style.transform = `translate(${imgRect.left}px, ${imgRect.top}px) scale(1)`;

    requestAnimationFrame(() => {
      floatingImg.style.transition = 'transform 200ms ease-out';
      floatingImg.style.transform = `translate(${cursorX + 10}px, ${cursorY + 10}px) scale(0.6)`;
    });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!pastedImage) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragImage(dragImageSrc);
      setIsDragging(true);
      setStartAnimation(true);
      setPosition({ x: e.clientX, y: e.clientY });
      requestAnimationFrame(() => animateToCursor(rect, e.clientX, e.clientY));
    }
  };

  const handlePastedClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (pastedImage) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragImage(pastedImage);
      setIsDragging(true);
      setPastedImage(null);
      setStartAnimation(true);
      setPosition({ x: e.clientX, y: e.clientY });
      requestAnimationFrame(() => animateToCursor(rect, e.clientX, e.clientY));
    }
  };

  const handleImageDrop = () => {
    if (isDragging && dragImage) {
      setPastedImage(dragImage);
      setIsDragging(false);
      setDragImage(null);
      setStartAnimation(false);
    }
  };

  const imageSizeClass = `w-full max-w-[${width}px] h-auto aspect-square`;
  const containerStyle = { width, height };

  return (
    <div className="relative w-full h-full flex items-center justify-center gap-10 px-4 flex-wrap">
      {/* Original Image */}
      <img
        src={dragImageSrc}
        alt="Copy"
        onClick={handleImageClick}
        className={`object-cover rounded shadow transition ${
          pastedImage ? 'cursor-auto' : 'cursor-copy'
        } ${imageSizeClass}`}
        style={containerStyle}
      />

      {/* Drop Zone */}
      <div
        ref={dropRef}
        onClick={handleImageDrop}
        className={`bg-[#1e1e1e] rounded shadow overflow-hidden ${imageSizeClass}`}
        style={containerStyle}
      >
        {pastedImage && (
          <img
            src={pastedImage}
            alt="Pasted"
            onClick={handlePastedClick}
            className="w-full h-full object-cover cursor-copy"
          />
        )}
      </div>

      {/* Floating image */}
      {isDragging && dragImage && (
        <img
          ref={dragImageRef}
          src={dragImage}
          alt="Dragging"
          className="fixed z-[9999] pointer-events-none rounded object-cover w-20 h-12"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${position.x + 10}px, ${position.y + 10}px) scale(0.6)`,
            transition: startAnimation ? 'transform 200ms ease-out' : 'none',
          }}
        />
      )}
    </div>
  );
}
