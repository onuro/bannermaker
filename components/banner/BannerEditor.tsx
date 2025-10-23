'use client'

import { useState, useRef } from 'react'
import { BannerCanvas, getCanvasBlob } from './BannerCanvas'
import { BannerComposer } from './BannerComposer'
import { TextEditor } from './TextEditor'
import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import { Download, Film } from 'lucide-react'
import { recordBannerVideo, downloadBlob } from '@/lib/videoRecorder'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { Check } from 'lucide-react'
import Image from 'next/image'

interface BackgroundOption {
  id: string
  name: string
  path: string
  type: 'image' | 'video'
}

const DEFAULT_BACKGROUNDS: BackgroundOption[] = [
  { id: '1', name: '4 blocks', path: '/backgrounds/one.jpg', type: 'image' },
  { id: '2', name: 'Node Elevated', path: '/backgrounds/two.jpg', type: 'image' },
  { id: '3', name: 'Flux Nodes BG', path: '/backgrounds/three.jpg', type: 'image' },
  { id: '4', name: 'Flux AI BG', path: '/backgrounds/four.jpg', type: 'image' },
  { id: '5', name: 'Flux Wallets BG', path: '/backgrounds/five.jpg', type: 'image' },
  { id: '6', name: 'Flux Kaspa BG', path: '/backgrounds/six.jpg', type: 'image' },
  { id: '7', name: 'Flux Arcane BG', path: '/backgrounds/seven.jpg', type: 'image' },
  { id: '9', name: 'Flux WP BG', path: '/backgrounds/nine.jpg', type: 'image' },
  { id: '8', name: 'Flux Generic BG 1', path: '/backgrounds/eight.jpg', type: 'image' },
  { id: '10', name: 'Flux Generic BG 2', path: '/backgrounds/ten.jpg', type: 'image' },
  { id: '11', name: 'Flux Generic BG 3', path: '/backgrounds/11.jpg', type: 'image' },
  { id: '12', name: 'Flux Generic BG 4', path: '/backgrounds/12.jpg', type: 'image' },
  { id: '13', name: 'Flux Generic BG 5', path: '/backgrounds/13.jpg', type: 'image' },
  { id: '14', name: 'Flux Generic BG 6', path: '/backgrounds/14.jpg', type: 'image' },
  { id: '15', name: 'Flux Generic BG 7', path: '/backgrounds/15.jpg', type: 'image' },
  { id: '16', name: 'Flux Generic BG 8', path: '/backgrounds/16.jpg', type: 'image' },
  { id: '17', name: 'Flux Generic BG 9', path: '/backgrounds/17.jpg', type: 'image' },
  { id: '18', name: 'Flux Generic BG 10', path: '/backgrounds/18.jpg', type: 'image' },
  { id: '19', name: 'Flux Generic BG 11', path: '/backgrounds/19.jpg', type: 'image' },
  { id: '20', name: 'Flux Generic BG 12', path: '/backgrounds/20.jpg', type: 'image' },
  { id: '21', name: 'Flux Generic BG 13', path: '/backgrounds/21.jpg', type: 'image' },
  { id: '22', name: 'Flux Generic BG 14', path: '/backgrounds/22.jpg', type: 'image' },
  // { id: '14', name: 'Video BG 1—ALPHA', path: '/backgrounds/video1.mp4', type: 'video' }
]

export function BannerEditor() {
  const [headline, setHeadline] = useState('Write a great headline here')
  const [subtext, setSubtext] = useState(
    'Enter description text. It can be the details of the post, a feature of Flux, or any other relevant information. Or remove if no need.'
  )
  const [selectedBackground, setSelectedBackground] = useState(DEFAULT_BACKGROUNDS[0].path)
  const [isExporting, setIsExporting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get current background type
  const currentBackground = DEFAULT_BACKGROUNDS.find(bg => bg.path === selectedBackground)
  const isVideoBackground = currentBackground?.type === 'video'

  const handleImageExport = async (format: 'png' | 'webp') => {
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      console.error('Canvas not found')
      return
    }

    const blob = await getCanvasBlob(canvas, format)
    if (!blob) {
      console.error('Failed to generate image')
      return
    }

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    link.download = `banner-${timestamp}.${format}`
    link.href = url
    link.click()

    // Cleanup
    URL.revokeObjectURL(url)
  }

  const handleVideoExport = async () => {
    setIsExporting(true)
    try {
      const composerElement = document.getElementById('banner-composer')
      if (!composerElement) {
        console.error('Banner composer not found')
        return
      }

      const videoElement = composerElement.querySelector('video')
      if (!videoElement) {
        console.error('Video element not found')
        return
      }

      // Get video duration (max 5 seconds)
      const duration = Math.min(videoElement.duration * 1000, 5000)

      const blob = await recordBannerVideo(composerElement, duration)
      if (!blob) {
        console.error('Failed to generate video')
        return
      }

      // Download the video
      const timestamp = new Date().toISOString().split('T')[0]
      downloadBlob(blob, `banner-${timestamp}.webm`)
    } catch (error) {
      console.error('Video export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <SidebarProvider
    style={{
      // @ts-expect-error CSS custom properties not typed
      "--sidebar-width": "32rem",
      "--sidebar": "white",
      "--sidebar-width-mobile": "20rem",
    }}
    >
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="border-b p-6">
            <div className="flex items-center gap-4">
              <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40.2683 0.000220899C48.1679 0.0532051 55.8749 2.44412 62.4175 6.87146C68.9601 11.2988 74.0452 17.5643 77.0316 24.8779C80.018 32.1914 80.772 40.2255 79.1984 47.967C77.6248 55.7085 73.7942 62.8107 68.1896 68.378C62.5849 73.9452 55.4573 77.7283 47.7055 79.2501C39.9536 80.7719 31.9248 79.9643 24.6313 76.929C17.3379 73.8938 11.1065 68.7669 6.72303 62.1949C2.33952 55.6229 0.000177686 47.9 0 40.0002C0.035862 29.3561 4.29848 19.1621 11.8502 11.6607C19.4019 4.15931 29.6241 -0.0350692 40.2683 0.000220899Z" fill="#2656D7"/>
                <path d="M45.04 63.2257L40.4532 65.8746L30.5997 60.1938L35.0745 57.61L35.1865 57.5448L45.04 63.2257Z" fill="white"/>
                <path d="M62.6476 27.4374V32.7692L50.3171 25.6506L32.7277 35.8088V38.9527L25.3539 34.6966L18.2614 38.7886V27.4374L40.4532 14.625L62.6476 27.4374Z" fill="white"/>
                <path d="M62.6476 38.8355V53.083L50.3197 60.1938H50.3041L37.9892 53.083V38.8355L50.3197 31.7143L62.6476 38.8355Z" fill="white"/>
                <path d="M32.4438 44.8575V53.0439L25.3513 57.1411L18.2614 53.0466V44.8601L25.3539 40.7655L32.4438 44.8575Z" fill="white"/>
              </svg>
              <div>
                <h2 className="text-lg font-bold">Banner Maker</h2>
                <p className="text-xs text-muted-foreground">Flux Marketing</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4 py-6">
            <div className="space-y-3 p-2">
              <h3 className="text-sm font-semibold">Backgrounds</h3>
              <div className="grid grid-cols-2 gap-3"> 
                {DEFAULT_BACKGROUNDS.map((bg) => {
                  const isSelected = selectedBackground === bg.path
                  return (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg.path)}
                      className={`
                        relative w-full aspect-[1200/650] rounded-lg overflow-hidden
                        border-2 transition-all duration-200 cursor-pointer
                        hover:scale-[1.02] hover:shadow-lg
                        ${isSelected
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }
                      `}
                      aria-label={`Select ${bg.name}`}
                    >
                      {bg.type === 'video' ? (
                        <video
                          src={bg.path}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={bg.path}
                          alt={bg.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                        <p className="text-[12px] text-white font-medium leading-tight">{bg.name}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-900 dark:to-zinc-800 p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">

              <TextEditor
                headline={headline}
                subtext={subtext}
                onHeadlineChange={setHeadline}
                onSubtextChange={setSubtext}
              />
              
<CardContent className="space-y-4">
                  {isVideoBackground ? (
                    <BannerComposer
                      headline={headline}
                      subtext={subtext}
                      backgroundVideo={selectedBackground}
                    />
                  ) : (
                    <BannerCanvas
                      headline={headline}
                      subtext={subtext}
                      background={selectedBackground}
                    />
                  )}

                <div className="flex gap-3">
                  {isVideoBackground ? (
                    <Button
                      onClick={handleVideoExport}
                      disabled={isExporting}
                      className="flex-1"
                      size="lg"
                    >
                      <Film className="mr-2 h-4 w-4" />
                      {isExporting ? 'Exporting...' : 'Export as Video (WebM)'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleImageExport('png')}
                        className="flex-1"
                        size="lg"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export as PNG
                      </Button>
                      <Button
                        onClick={() => handleImageExport('webp')}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export as WebP
                      </Button>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Export size: 2400 × 1300px {isVideoBackground && '(~5 second video)'}
                </p>
              </CardContent>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}