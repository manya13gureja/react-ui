
'use client'
import { useState } from "react";
import Link from "next/link";
import projects from '@/data/interactions.json';

const filters = [
  { id: "Creative Direction & Consultation", position: "top-left" },
  { id: "Print Design & Editorial Design", position: "top-right" },
  { id: "Social Media & Graphic Design", position: "center-left" },
  { id: "Art Direction", position: "center-right" },
  { id: "Website Design", position: "bottom-left" },
  { id: "Brand Strategy", position: "bottom-right" },
];

const interactions = [
  { title: "Dior Drop", tags: ["Creative Direction & Consultation", "Art Direction"] },
  { title: "Community Garden", tags: ["Website Design", "Brand Strategy"] },
  { title: "Fashion Blur", tags: ["Print Design & Editorial Design"] },
  { title: "Social Reboot", tags: ["Social Media & Graphic Design"] },
];

const getPositionClasses = (position: string) => {
  // For absolute positioning on larger screens only
  const positions = {
    'top-left': 'lg:absolute lg:top-24 lg:left-24',
    'top-right': 'lg:absolute lg:top-24 lg:right-92',
    'center-left': 'lg:absolute lg:top-1/2 lg:left-92 lg:-translate-y-1/2',
    'center-right': 'lg:absolute lg:top-1/2 lg:right-16 lg:-translate-y-1/2',
    'bottom-left': 'lg:absolute lg:bottom-32 lg:left-12 lg:-translate-y-2',
    'bottom-right': 'lg:absolute lg:bottom-32 lg:right-76 lg:-translate-y-2/3'
  };
  return positions[position as keyof typeof positions] || '';
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const filteredInteractions = activeFilter
    ? interactions.filter(interaction => interaction.tags.includes(activeFilter))
    : interactions;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-black bg-white">
        <h1 className="text-4xl font-bold">UI Interactions</h1>
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
<section className="px-8 py-8">
  <div className="grid grid-cols-6 gap-8 max-w-6xl mx-auto px-6 py-12">
    {projects.map((project, idx) => (
      <div key={idx} className="col-span-6 grid grid-cols-6 gap-6 mb-16">
        
        {/* Left: Video + Photo */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          <div className="bg-blue-500 aspect-[3/4] col-span-1 flex items-center justify-center text-white font-bold">
            video
          </div>
          <div className="bg-blue-400 aspect-[6/4] col-span-1 mt-2 flex items-center justify-center text-white font-bold">
            photo
          </div>
        </div>

        {/* Right: Text Block */}
        <div className="col-span-3 relative flex flex-col justify-center text-sm leading-relaxed">
          <div className="absolute top-0 left-0 text-lg font-semibold tracking-widest">
            {project.date || '18–24'}
          </div>
          <p className="text-gray-700 max-w-md mt-10">{project.description}</p>
          <Link
            href={`/interactions/${project.slug}`}
            className="mt-4 text-xs uppercase tracking-wide hover:underline underline-offset-4 cursor-pointer inline-block"
          >
            See More
          </Link>
        </div>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}