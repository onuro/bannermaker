'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface BannerComposerProps {
  headline: string
  subtext: string
  backgroundVideo: string
}

const SCALE_FACTOR = 2
const BANNER_WIDTH = 1200 * SCALE_FACTOR
const BANNER_HEIGHT = 650 * SCALE_FACTOR

export function BannerComposer({ headline, subtext, backgroundVideo }: BannerComposerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-play video when mounted
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed:', err)
      })
    }
  }, [backgroundVideo])

  return (
    <div
      ref={containerRef}
      id="banner-composer"
      style={{
        width: `${BANNER_WIDTH}px`,
        height: `${BANNER_HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
      }}
      className="border border-gray-300 rounded-lg shadow-lg max-w-full h-auto"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        src={backgroundVideo}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        muted
        loop
        playsInline
        autoPlay
      />

      {/* Blur overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.05) 90%, rgba(0,0,0,0) 100%)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
        }}
      />

      {/* Flux Logo */}
      <Image
        src="/flux-logo.svg"
        alt="Flux Logo"
        style={{
          position: 'absolute',
          top: `${90/2 * SCALE_FACTOR}px`,
          left: `${90/2 * SCALE_FACTOR}px`,
          width: `${200/2 * SCALE_FACTOR}px`,
          height: 'auto',
        }}
      />

      {/* Text Content */}
      <div
        style={{
          position: 'absolute',
          bottom: `${80/2 * SCALE_FACTOR}px`,
          left: `${90/2 * SCALE_FACTOR}px`,
          right: `${90/2 * SCALE_FACTOR}px`,
          color: 'white',
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontSize: `${56/2 * SCALE_FACTOR}px`,
            fontWeight: 'bold',
            fontFamily: 'Gilroy, system-ui, -apple-system, sans-serif',
            lineHeight: 1.4,
            marginBottom: `${32/2 * SCALE_FACTOR}px`,
            color: '#ffffff',
          }}
        >
          {headline}
        </h1>

        {/* Subtext */}
        {subtext && (
          <p
            style={{
              fontSize: `${24/2 * SCALE_FACTOR}px`,
              fontFamily: 'Figtree, system-ui, -apple-system, sans-serif',
              lineHeight: 1.6/2,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

// Export function to get current video time
export function getVideoCurrentTime(videoElement: HTMLVideoElement): number {
  return videoElement.currentTime
}

// Export function to get video duration
export function getVideoDuration(videoElement: HTMLVideoElement): number {
  return videoElement.duration
}