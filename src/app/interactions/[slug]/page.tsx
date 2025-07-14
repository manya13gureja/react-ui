'use client'

import { useState, use } from 'react'
import { notFound } from 'next/navigation'
import projects from '@/data/interactions.json'
import { ScrollPreview } from '@/app/components/ScrollPreview'
import { DebugWrapper } from '@/app/components/Debugwrapper'
import { Lato } from 'next/font/google'
import { Bug } from 'lucide-react'
import { HoverLinkPreview } from '@/app/components/HoverLink'
import {ClickAndPaste} from '@/app/components/CopyPaste'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
})

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const project = projects.find((p) => p.slug === slug)
  if (!project) return notFound()

  const [debug, setDebug] = useState(false)

  const useDebug = project.wrapper === 'DebugWrapper'
  const useScroll = project.wrapper === 'ScrollPreview'
  const useLinkPreview = project.wrapper === 'HoverLinkPreview'
  const useCopyPaste = project.wrapper === 'ClickAndPaste'

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white text-black overflow-visible ">

      {/* ScrollPreview interaction */}
      {useScroll && <ScrollPreview sections={project.sections || []} />}

      {/* Header */}
      <section id="section1" className="max-width-site mx-auto px-6 pt-24">
        {useDebug && (
          <div className="text-center mb-8">
            <button
              onClick={() => setDebug(!debug)}
              aria-label="Toggle Debug Mode"
              className={`
                flex items-center justify-center p-2 rounded-full border
                ${debug ? 'bg-black text-white opacity-100' : 'bg-gray-200 text-gray-500 opacity-60'}
                hover:opacity-100 hover:scale-105 transition-all duration-200 mx-auto
              `}
            >
              <Bug className="w-5 h-5" />
            </button>
            <p className="text-xs text-gray-500 mt-2">
              {debug ? 'Debugger On' : 'Debugger Off'}
            </p>
          </div>
        )}
        <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
        <p className={`text-base text-gray-700 leading-relaxed ${lato.className}`}>
          {project.description}
        </p>
      </section>

      {/* Video Section */}
      <section id="section2" className="max-width-site mx-auto px-6 mt-20 mb-20">
        {useDebug ? (
          <DebugWrapper debug={debug} label="Video">
            <div className="flex justify-center">
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                className="rounded-xl shadow-xl w-full"
              />
            </div>
          </DebugWrapper>
        ) : (
          <div className="flex justify-center">
            <video
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              className="rounded-xl shadow-xl w-full"
            />
          </div>
        )}
      </section>

      {/* Gist Section */}
      <section id="section3" className="max-width-site mx-auto px-6 mt-20 mb-20">
        <h2 className="text-2xl font-bold mb-0">Gist</h2>
        {project.content.map((text: string, i: number) =>
          useDebug ? (
            <DebugWrapper key={i} debug={debug} label={`Paragraph ${i + 1}`}>
              <p className={`mt-6 text-gray-600 leading-relaxed ${lato.className}`}>
                {text}
              </p>
            </DebugWrapper>
          ) : (
            <p key={i} className={`mt-6 text-gray-600 leading-relaxed ${lato.className}`}>
              {text}
            </p>
          )
        )}
      </section>

      {/* LinkPreview Section */}

      {useLinkPreview && project.links && (
        <section className="max-width-site flex flex-col gap-2 mx-auto  space-y-8">
          {project.links.map((link: any, i: number) => (
            <div key={i} className="pb-6"> 
              <HoverLinkPreview
              label={link.label}
              url={link.url}
              image={link.image}
          />
  </div>
          ))}
        </section>
      )}
      {/* ClickAndPaste Section */}
      {useCopyPaste && (
        <section className="max-width-site mx-auto px-6 mt-20 mb-20">
          <ClickAndPaste />
        </section>
      )}
      {/* Footer */}
      
  <section className="max-w-4xl mx-auto px-6 pt-24 pb-8 text-center text-sm text-pink-900 font-light">
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
  )
}