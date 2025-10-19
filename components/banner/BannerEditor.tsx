'use client'

import { useState, useRef } from 'react'
import { BannerCanvas, getCanvasBlob } from './BannerCanvas'
import { BannerComposer } from './BannerComposer'
import { TextEditor } from './TextEditor'
import { BackgroundSelector } from './BackgroundSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Film } from 'lucide-react'
import { recordBannerVideo, downloadBlob } from '@/lib/videoRecorder'

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
  // { id: '14', name: 'Video BG 1—ALPHA', path: '/backgrounds/video1.mp4', type: 'video' }
]

export function BannerEditor() {
  const [headline, setHeadline] = useState('FluxEdge: Cost-Effective & Scalable')
  const [subtext, setSubtext] = useState(
    'A decentralized edge computing network that dramatically reduces latency and costs for modern applications.'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start gap-6">
          <svg width="40" className='w-12 h-12 translate-y-1' height="40" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40.2683 0.000220899C48.1679 0.0532051 55.8749 2.44412 62.4175 6.87146C68.9601 11.2988 74.0452 17.5643 77.0316 24.8779C80.018 32.1914 80.772 40.2255 79.1984 47.967C77.6248 55.7085 73.7942 62.8107 68.1896 68.378C62.5849 73.9452 55.4573 77.7283 47.7055 79.2501C39.9536 80.7719 31.9248 79.9643 24.6313 76.929C17.3379 73.8938 11.1065 68.7669 6.72303 62.1949C2.33952 55.6229 0.000177686 47.9 0 40.0002C0.035862 29.3561 4.29848 19.1621 11.8502 11.6607C19.4019 4.15931 29.6241 -0.0350692 40.2683 0.000220899Z" fill="#2656D7"/>
            <path d="M45.04 63.2257L40.4532 65.8746L30.5997 60.1938L35.0745 57.61L35.1865 57.5448L45.04 63.2257Z" fill="white"/>
            <path d="M62.6476 27.4374V32.7692L50.3171 25.6506L32.7277 35.8088V38.9527L25.3539 34.6966L18.2614 38.7886V27.4374L40.4532 14.625L62.6476 27.4374Z" fill="white"/>
            <path d="M62.6476 38.8355V53.083L50.3197 60.1938H50.3041L37.9892 53.083V38.8355L50.3197 31.7143L62.6476 38.8355Z" fill="white"/>
            <path d="M32.4438 44.8575V53.0439L25.3513 57.1411L18.2614 53.0466V44.8601L25.3539 40.7655L32.4438 44.8575Z" fill="white"/>
          </svg>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Banner Maker</h1>
            <p className="text-gray-600">Flux Marketing image generator</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-6">

            <BackgroundSelector
              backgrounds={DEFAULT_BACKGROUNDS}
              selectedBackground={selectedBackground}
              onBackgroundChange={setSelectedBackground}
            />
          </div>

          {/* Right Column - Preview & Export */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <TextEditor
              headline={headline}
              subtext={subtext}
              onHeadlineChange={setHeadline}
              onSubtextChange={setSubtext}
            />
              <CardContent className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
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
                </div>

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
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}