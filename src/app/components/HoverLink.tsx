'use client'

import { useState } from 'react'
import { Tooltip } from 'react-tooltip'

type HoverLinkPreviewProps = {
  url: string
  label: string
  image: string
}

// Helper function to create a consistent hash from a string
function createHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

export function HoverLinkPreview({ url, label, image }: HoverLinkPreviewProps) {
  const [imageError, setImageError] = useState(false)
  
  const tooltipId = `tooltip-${createHash(url + label)}`

  return (
    <>
   <div className="inline-block">
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline text-base font-medium text-black hover:text-gray-900 relative group"
    data-tooltip-id={tooltipId}
    data-tooltip-place="top"
  >
    
     <span className="underline-animation">{label}</span>
  </a>
</div>
      
      <Tooltip
        id={tooltipId}
        place="top"
        delayShow={300}
        delayHide={100}
        float={false}
       
        className="!opacity-100 !z-[9999] "
      
        style={{
          backgroundColor: 'white',
          padding: 0,
          border: 'black',
          borderRadius: 20,
          boxShadow: 'none',
          zIndex: 9999,
          transition: 'none', 
        }}
        noArrow={true}
      >
    
        <div className="transition-discrete md:transition-normal w-52 px-2 py-2 rounded-xl overflow-hidden bg-white shadow-lg border tooltip-animate ">
          {!imageError ? (
            <img
              src={image}
              alt={`Preview for ${label}`}
              className="w-full h-32 object-cover rounded-xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center text-sm text-gray-500 bg-gray-100">
              No Preview Available
            </div>
          )}
        </div>
      </Tooltip>
    </>
  )
}