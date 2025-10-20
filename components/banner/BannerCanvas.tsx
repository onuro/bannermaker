'use client'

import { useEffect, useRef, useState } from 'react'

interface BannerCanvasProps {
  headline: string
  subtext: string
  background: string
  logo?: string
}

interface TextLayout {
  headlineLines: string[]
  subtextLines: string[]
  headlineY: number
  subtextY: number
  overlayHeight: number
  maxWidth: number
}

const SCALE_FACTOR = 2
const CANVAS_WIDTH = 1200 * SCALE_FACTOR
const CANVAS_HEIGHT = 650 * SCALE_FACTOR
const LOGO_POSITION = { x: 90 * SCALE_FACTOR, y: 90 * SCALE_FACTOR }
const TEXT_MARGIN = { left: 90 * SCALE_FACTOR, right: 90 * SCALE_FACTOR, bottom: 80 * SCALE_FACTOR }
const LINE_HEIGHTS = { headline: 72 * SCALE_FACTOR, subtext: 38 * SCALE_FACTOR } // 54px * 140% = 76px, 24px * 160% = 38px
const FONTS = {
  headline: `bold ${56 * SCALE_FACTOR}px Gilroy, system-ui, -apple-system, sans-serif`,
  subtext: `${24 * SCALE_FACTOR}px Figtree, system-ui, -apple-system, sans-serif`
}

export function BannerCanvas({ headline, subtext, background, logo }: BannerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load fonts for canvas rendering
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Load Gilroy font
        const gilroy = new FontFace(
          'Gilroy',
          'url(/fonts/Gilroy-bold.woff2) format("woff2")',
          { weight: '700', style: 'normal' }
        )
        
        await gilroy.load()
        document.fonts.add(gilroy)
        
        // Wait for Figtree to be available (loaded via Next.js)
        await document.fonts.ready
        
        setFontsLoaded(true)
      } catch (error) {
        console.warn('Font loading failed, using fallback fonts:', error)
        setFontsLoaded(true) // Continue anyway with fallback fonts
      }
    }
    
    loadFonts()
  }, [])

  useEffect(() => {
    if (!fontsLoaded) return // Wait for fonts to load
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Set loading state
    setIsLoading(true)

    // Load and draw background
    const bgImage = new Image()
    bgImage.crossOrigin = 'anonymous'
    bgImage.onload = () => {
      setIsLoading(false)
      // Draw clean background first
      ctx.drawImage(bgImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Calculate text layout
      const textLayout = calculateTextLayout(ctx, headline, subtext)
      
      // Apply background blur to the overlay area
      applyBackgroundBlur(ctx, bgImage, textLayout.overlayHeight)
      
      // Apply progressive overlay for text contrast
      applyProgressiveOverlay(ctx, textLayout.overlayHeight)

      // Always draw the Flux logo
      const fluxLogo = new Image()
      fluxLogo.crossOrigin = 'anonymous'
      fluxLogo.onload = () => {
        // Calculate logo dimensions (maintaining aspect ratio)
        const logoWidth = 200 * SCALE_FACTOR  // Reasonable size for the banner
        const logoHeight = (fluxLogo.height / fluxLogo.width) * logoWidth
        
        ctx.drawImage(fluxLogo, LOGO_POSITION.x, LOGO_POSITION.y, logoWidth, logoHeight)
        
        // DEBUG: Show logo position
        // ctx.strokeStyle = 'orange'
        // ctx.lineWidth = 2
        // ctx.strokeRect(LOGO_POSITION.x, LOGO_POSITION.y, logoWidth, logoHeight)
        
        // ctx.fillStyle = 'orange'
        // ctx.font = 'bold 12px Arial'
        // ctx.fillText(`LOGO: ${LOGO_POSITION.x}px, ${LOGO_POSITION.y}px`, LOGO_POSITION.x, LOGO_POSITION.y - 10)
        
        drawTextWithLayout(ctx, headline, subtext, textLayout)
      }
      fluxLogo.onerror = () => {
        console.error('Failed to load Flux logo')
        drawTextWithLayout(ctx, headline, subtext, textLayout)
      }
      fluxLogo.src = '/flux-logo.svg'
    }

    bgImage.onerror = () => {
      setIsLoading(false)
      console.error('Failed to load background')
      // Draw a fallback background
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      
      const textLayout = calculateTextLayout(ctx, headline, subtext)
      
      // Fallback solid background
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      
      applyProgressiveOverlay(ctx, textLayout.overlayHeight)
      drawTextWithLayout(ctx, headline, subtext, textLayout)
    }

    bgImage.src = background

    function calculateTextLayout(ctx: CanvasRenderingContext2D, headline: string, subtext: string) {
      const maxWidth = CANVAS_WIDTH - TEXT_MARGIN.left - TEXT_MARGIN.right
      
      // Calculate headline dimensions
      ctx.font = FONTS.headline
      const headlineLines = getWrappedLines(ctx, headline, maxWidth)
      const headlineHeight = headlineLines.length * LINE_HEIGHTS.headline
      
      // Calculate subtext dimensions
      ctx.font = FONTS.subtext
      const subtextLines = subtext.trim() ? getWrappedLines(ctx, subtext, maxWidth) : []
      const subtextHeight = subtextLines.length * LINE_HEIGHTS.subtext
      
      // Calculate total content height and positioning (matching Figma layout)
      const headlineSubtextGap = subtextLines.length > 0 ? 32 * SCALE_FACTOR : 0 // 32px gap between headline and description
      const totalContentHeight = headlineHeight + (subtextLines.length > 0 ? subtextHeight + headlineSubtextGap : 0)
      
      // Position text so bottom of content is exactly 120px from canvas bottom
      const contentBottomY = CANVAS_HEIGHT - TEXT_MARGIN.bottom
      const contentStartY = contentBottomY - totalContentHeight
      
      // Blur overlay should extend 60px above the text content
      const overlayTopPadding = 60 * SCALE_FACTOR
      const overlayHeight = totalContentHeight + overlayTopPadding + TEXT_MARGIN.bottom
      
      return {
        headlineLines,
        subtextLines,
        headlineY: contentStartY,
        subtextY: contentStartY + headlineHeight + headlineSubtextGap,
        overlayHeight: Math.min(overlayHeight, CANVAS_HEIGHT * 0.6), // Max 65% of canvas height
        maxWidth
      }
    }

    function getWrappedLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
      const words = text.split(' ')
      const lines: string[] = []
      let line = ''

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width

        if (testWidth > maxWidth && i > 0) {
          lines.push(line.trim())
          line = words[i] + ' '
        } else {
          line = testLine
        }
      }
      lines.push(line.trim())
      return lines.filter(line => line.length > 0)
    }

    function applyProgressiveOverlay(ctx: CanvasRenderingContext2D, overlayHeight: number) {
      const startY = CANVAS_HEIGHT - overlayHeight
      
      // DEBUG: Red border around overlay area
      // ctx.strokeStyle = 'red'
      // ctx.lineWidth = 3
      // ctx.strokeRect(0, startY, CANVAS_WIDTH, overlayHeight)
      
      // DEBUG: Add text showing overlay parameters
      // ctx.fillStyle = 'lime'
      // ctx.font = 'bold 16px Arial'
      // ctx.fillText(`BLUR OVERLAY: H=${overlayHeight}px, Y=${startY}px`, 20, startY + 25)
      
      // Create smooth progressive gradient overlay
      const gradient = ctx.createLinearGradient(0, startY, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')      // Completely transparent at top
      gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.05)')  // Very subtle start
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.1)')  // Light overlay
      gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)')  // Medium overlay
      gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.35)')  // Strong overlay
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)')     // Maximum overlay at bottom
      
      // Apply the progressive overlay
      ctx.fillStyle = gradient
      ctx.fillRect(0, startY, CANVAS_WIDTH, overlayHeight)
    }

    function applyBackgroundBlur(ctx: CanvasRenderingContext2D, bgImage: HTMLImageElement, overlayHeight: number) {
      const startY = CANVAS_HEIGHT - overlayHeight
      
      // Create progressive blur with multiple strips
      const numStrips = 40 * SCALE_FACTOR  // More strips for smoother transition
      const stripHeight = overlayHeight / numStrips
      const minBlur = 0 * SCALE_FACTOR      // Minimum blur at the top
      const maxBlur = 25 * SCALE_FACTOR     // Maximum blur at the bottom
      
      for (let i = 0; i < numStrips; i++) {
        const stripY = startY + (i * stripHeight)
        const blurProgress = i / (numStrips - 1) // 0 to 1
        const blurAmount = minBlur + (blurProgress * (maxBlur - minBlur)) // minBlur to maxBlur
        
        // Save canvas state
        ctx.save()
        
        // Set progressive blur
        ctx.filter = `blur(${blurAmount}px)`
        
        // Create clipping region for this strip
        ctx.beginPath()
        ctx.rect(0, stripY, CANVAS_WIDTH, stripHeight + 1) // +1 to avoid gaps
        ctx.clip()
        
        // Draw background image with current blur level
        ctx.drawImage(bgImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        
        // Restore state
        ctx.restore()
      }
      
      // DEBUG: Blue border around blurred area
      // ctx.strokeStyle = 'blue'
      // ctx.lineWidth = 2
      // ctx.strokeRect(0, startY, CANVAS_WIDTH, overlayHeight)
      
      // DEBUG: Add text showing blur is applied
      // ctx.fillStyle = 'cyan'
      // ctx.font = 'bold 14px Arial'
      // ctx.fillText(`PROGRESSIVE BLUR: 0px → ${maxBlur}px (${numStrips} strips)`, 20, startY + 50)
      
      // DEBUG: Show blur levels at different points
      // ctx.fillStyle = 'yellow'
      // ctx.font = 'bold 12px Arial'
      // for (let i = 0; i < 5; i++) {
      //   const testY = startY + (i * overlayHeight / 4)
      //   const testProgress = (testY - startY) / overlayHeight
      //   const testBlur = testProgress * maxBlur
      //   ctx.fillText(`${testBlur.toFixed(1)}px`, CANVAS_WIDTH - 100, testY + 20)
      // }
    }

    function drawTextWithLayout(
      ctx: CanvasRenderingContext2D,
      headline: string,
      subtext: string,
      layout: TextLayout
    ) {
      if (!ctx) return

      // Draw headline
      ctx.fillStyle = '#ffffff'
      ctx.font = FONTS.headline
      ctx.textBaseline = 'top'
      
      let currentY = layout.headlineY
      layout.headlineLines.forEach((line: string) => {
        ctx.fillText(line, TEXT_MARGIN.left, currentY)
        currentY += LINE_HEIGHTS.headline
      })

      // Draw subtext if exists
      if (layout.subtextLines.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
        ctx.font = FONTS.subtext
        
        currentY = layout.subtextY
        layout.subtextLines.forEach((line: string) => {
          ctx.fillText(line, TEXT_MARGIN.left, currentY)
          currentY += LINE_HEIGHTS.subtext
        })
      }
    }

  }, [headline, subtext, background, logo, fontsLoaded])

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300"
          style={{ aspectRatio: '1200/650' }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading background...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        // style={{ width: '1200px', height: '650px' }}
        className={`border border-gray-300 rounded-lg shadow-lg max-w-full h-auto transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  )
}

export function getCanvasBlob(canvasElement: HTMLCanvasElement, format: 'png' | 'webp'): Promise<Blob | null> {
  return new Promise((resolve) => {
    const mimeType = format === 'webp' ? 'image/webp' : 'image/png'
    canvasElement.toBlob((blob) => resolve(blob), mimeType, 1.0)
  })
}