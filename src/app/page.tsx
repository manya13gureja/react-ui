
'use client'
import { useState } from "react";
import Link from "next/link";
import projects from '@/data/interactions.json';
import { HoverLinkPreview } from '@/app/components/HoverLink';

const filters = [
  { id: "Interface Interactions", position: "top-left" },
  { id: "Navigation Enhancement Interactions", position: "top-right" },
  { id: "Content Handling Interactions", position: "center-left" },
  
];

const interactions = [
  { title: "Visual Debugger", tags: ["Interface Interactions"] },
  { title: "Scroll Preview", tags: ["Navigation Enhancement Interactions"] },
  { title: "Link Hover Preview", tags: ["Navigation Enhancement Interactions"] },
  { title: "Click And Paste", tags: ["Content Handling Interactions"] },
];

const getPositionClasses = (position: string) => {
  // For absolute positioning on larger screens only
  const positions = {
    'top-left': 'lg:absolute lg:top-24 lg:left-32',
    'top-right': 'lg:absolute lg:top-24 lg:right-42',
    'center-left': 'lg:absolute lg:top-1/2 lg:left-130 lg:-translate-y-1/2',
    'center-right': 'lg:absolute lg:top-1/2 lg:right-16 lg:-translate-y-1/2',
    'bottom-left': 'lg:absolute lg:bottom-32 lg:left-12 lg:-translate-y-2',
    'bottom-right': 'lg:absolute lg:bottom-32 lg:right-76 lg:-translate-y-2/3'
  };
  return positions[position as keyof typeof positions] || '';
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
 const filteredInteractions = activeFilter
  ? projects.filter(project => project.tags.includes(activeFilter))
  : projects;

  return (
    
    <div className="relative min-h-screen overflow-hidden">

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-b-gray-400">
        <h1 className="text-2xl font-bold">UI Interactions</h1>
        <a href="/events" className="text-sm tracking-wide uppercase hover:underline">
          About →
        </a>
      </header>

      {/* Filters Section */}
      <section className="relative h-auto lg:h-96 overflow-hidden">
        {/* Mobile/Tablet: Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 p-6">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setActiveFilter(prev => prev === filterItem.id ? null : filterItem.id)}
              className={`
                text-sm uppercase tracking-wide transition-all duration-200
                hover:scale-105 hover:text-gray-600 text-left
                ${activeFilter === filterItem.id ? 'font-bold text-black' : 'text-gray-800'}
              `}
            >
              {filterItem.id} —
            </button>
          ))}
        </div>
        
        {/* Desktop: Absolute positioning */}
        <div className="hidden lg:block">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setActiveFilter(prev => prev === filterItem.id ? null : filterItem.id)}
              className={`
                text-sm uppercase tracking-wide transition-all duration-200
                hover:scale-105 hover:text-gray-600
                ${getPositionClasses(filterItem.position)}
                ${activeFilter === filterItem.id ? 'font-bold text-black' : 'text-gray-800'}
              `}
            >
              {filterItem.id} —
            </button>
          ))}
        </div>
      </section>


{/* Interactions Grid */}
{/* Interactions Grid */}
<section className="pb-12">
  <div className="max-w-6xl mx-auto space-y-24">
    {filteredInteractions.map((project, idx) => (
      <div
        key={idx}
        className="grid grid-cols-1 lg:grid-cols-6 gap-10 items-center"
      >
        {/* Left: Video */}
        <div className="lg:col-span-3 w-full flex justify-center">
          <div className="w-full max-w-md aspect-video rounded-xl shadow-xl overflow-hidden">
            <video
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Text */}
        <div className="lg:col-span-3 flex flex-col justify-center text-center lg:text-left gap-4 px-4 lg:px-0">
          <div className="text-lg text-black font-bold uppercase tracking-widest ">
            {project.title}
          </div>
          <p className="text-gray-800 leading-relaxed text-base max-w-xl mx-auto lg:mx-0">
            {project.description}
          </p>
          <Link
            href={`/interactions/${project.slug}`}
            className="text-xs uppercase tracking-wide hover:underline underline-offset-4 text-black"
          >
            See More →
          </Link>
        </div>
      </div>
      
    ))}
    <section className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center text-sm text-pink-900 font-light">
  <div className="inline-block">
    Built by{' '}
    <HoverLinkPreview
      label="Manya"
      url="https://x.com/milkfuggler"
      image="/manya.png"
    />
  </div>
</section>
  </div>
</section>
</div>
  );
}