'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import { DebugWrapper } from '@/app/components/Debugwrapper'
import { Lato } from 'next/font/google'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
})

export default function ClientPage({ project }: { project: any }) {
  const [debug, setDebug] = useState(false)
  if (!project) return notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white text-black">
      {/* Header */}
      <DebugWrapper debug={debug} label="Header" className="max-width-site mx-auto px-6 pt-24">
        <DebugWrapper debug={debug} label="H1 Title">
          <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
        </DebugWrapper>
        <p className={`text-base text-gray-700 leading-relaxed ${lato.className}`}>
          {project.description}
        </p>
        <DebugWrapper debug={debug} label="Switch">
          <label className="mt-8 flex items-center gap-4 cursor-pointer justify-center select-none">
            <span className="uppercase text-sm tracking-wide">
              {debug ? 'Disable' : 'Enable'} Debugger
            </span>
            <input
              type="checkbox"
              checked={debug}
              onChange={() => setDebug(!debug)}
              className="sr-only"
            />
            <span className={`w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-200 ${debug ? 'bg-black' : 'bg-gray-300'}`}>
              <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${debug ? 'translate-x-4' : ''}`}></span>
            </span>
          </label>
        </DebugWrapper>
      </DebugWrapper>

      {/* Example Video */}
      <DebugWrapper debug={debug} label="Video">
        <section className="max-width-site mx-auto px-6 mt-20">
          <div className="flex justify-center">
            <video
              src={`/videos/${project.slug}.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="rounded-xl shadow-xl w-full"
            />
          </div>
        </section>
      </DebugWrapper>

      {/* Description */}
      <DebugWrapper debug={debug} label="Description Paragraph" className="max-width-site mx-auto px-6 mt-20 mb-20">
        <h2 className="text-2xl font-bold mb-0">Gist</h2>
        <DebugWrapper debug={debug} label="Paragraph 1">
          <p className={`mt-6 text-gray-600 leading-relaxed ${lato.className}`}>Modern design systems increasingly use layout components like Stack, Flex, and Grid, making layouts more intuitive and declarative. <br /></p>
        </DebugWrapper>
        <DebugWrapper debug={debug} label="Paragraph 2">
          <p className={`mt-6 text-gray-600 leading-relaxed ${lato.className}`}>However, deeply nested components can obscure the true structure of a layout, making it difficult for developers and designers to quickly understand spacing and hierarchy. <br /></p>
        </DebugWrapper>
        <DebugWrapper debug={debug} label="Paragraph 3">
          <p className={`mt-6 text-gray-600 leading-relaxed ${lato.className}`}>By adding a debug property to layout components, developers can toggle a visualization mode that highlights whitespace with varying background shades based on nesting level. <br /></p>
        </DebugWrapper>
        <DebugWrapper debug={debug} label="Paragraph 4">
          <p className={`mt-6 text-gray-600 leading-relaxed ${lato.className}`}>Elements that add spacing also reveal their exact pixel values on hover, making it easier to inspect and refine layouts.</p>
        </DebugWrapper>
      </DebugWrapper>
    </div>
  )
}