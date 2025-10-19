'use client'

import { useState, useRef } from 'react'
import { BannerCanvas, getCanvasBlob } from './BannerCanvas'
import { TextEditor } from './TextEditor'
import { BackgroundSelector } from './BackgroundSelector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'

interface BackgroundOption {
  id: string
  name: string
  path: string
}

const DEFAULT_BACKGROUNDS: BackgroundOption[] = [
  { id: '1', name: '4 blocks', path: '/backgrounds/one.jpg' },
  { id: '2', name: 'Node Elevated', path: '/backgrounds/two.jpg' },
  { id: '3', name: 'Flux Nodes BG', path: '/backgrounds/three.jpg' },
]

export function BannerEditor() {
  const [headline, setHeadline] = useState('FluxEdge: Cost-Effective & Scalable')
  const [subtext, setSubtext] = useState(
    'A decentralized edge computing network that dramatically reduces latency and costs for modern applications.'
  )
  const [selectedBackground, setSelectedBackground] = useState(DEFAULT_BACKGROUNDS[0].path)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleExport = async (format: 'png' | 'webp') => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Banner Maker</h1>
          <p className="text-gray-600">Flux Marketing image generator</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-2 space-y-6">
            <TextEditor
              headline={headline}
              subtext={subtext}
              onHeadlineChange={setHeadline}
              onSubtextChange={setSubtext}
            />

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
              <CardContent className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <BannerCanvas
                    headline={headline}
                    subtext={subtext}
                    background={selectedBackground}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleExport('png')}
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as PNG
                  </Button>
                  <Button
                    onClick={() => handleExport('webp')}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export as WebP
                  </Button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Export size: 1200 × 650px
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}