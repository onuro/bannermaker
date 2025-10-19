/**
 * Record a DOM element containing video and overlays using MediaRecorder API
 * Returns a video blob (WebM format)
 */
export async function recordBannerVideo(
  containerElement: HTMLElement,
  duration: number = 5000
): Promise<Blob | null> {
  try {
    // Find the video element within the container
    const videoElement = containerElement.querySelector('video')
    if (!videoElement) {
      throw new Error('No video element found in container')
    }

    // Create a canvas to composite the video and overlays
    const canvas = document.createElement('canvas')
    canvas.width = 2400
    canvas.height = 1300
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Get canvas stream for recording
    const canvasStream = canvas.captureStream(30) // 30 FPS

    // Setup MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'
    
    const mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType,
      videoBitsPerSecond: 5000000, // 5 Mbps for high quality
    })

    const chunks: Blob[] = []
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType })
        resolve(blob)
      }

      mediaRecorder.onerror = (event) => {
        reject(new Error('MediaRecorder error'))
      }

      // Start recording
      mediaRecorder.start(100) // Collect data every 100ms

      // Restart video from beginning
      videoElement.currentTime = 0
      videoElement.play()

      // Render frames to canvas
      const startTime = Date.now()
      const renderFrame = () => {
        const elapsed = Date.now() - startTime
        
        if (elapsed >= duration) {
          mediaRecorder.stop()
          videoElement.pause()
          return
        }

        // Draw video frame
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

        // Draw overlays (blur gradient)
        const gradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height)
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
        gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0.05)')
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.15)')
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.35)')
        gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.55)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5)

        // Draw logo
        const logoImg = new Image()
        logoImg.src = '/flux-logo.svg'
        if (logoImg.complete) {
          ctx.drawImage(logoImg, 180, 180, 400, 400 * (logoImg.height / logoImg.width))
        }

        // Draw text
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 112px Gilroy, system-ui, -apple-system, sans-serif'
        ctx.textBaseline = 'bottom'
        
        // Get headline from container
        const headlineElement = containerElement.querySelector('h1')
        if (headlineElement) {
          const headline = headlineElement.textContent || ''
          ctx.fillText(headline, 180, canvas.height - 160 - 64)
        }

        // Draw subtext
        const subtextElement = containerElement.querySelector('p')
        if (subtextElement) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
          ctx.font = '48px Figtree, system-ui, -apple-system, sans-serif'
          const subtext = subtextElement.textContent || ''
          ctx.fillText(subtext, 180, canvas.height - 160)
        }

        requestAnimationFrame(renderFrame)
      }

      renderFrame()
    })
  } catch (error) {
    console.error('Error recording video:', error)
    return null
  }
}

/**
 * Convert WebM blob to MP4 using FFmpeg.wasm
 * This is a placeholder - actual implementation requires FFmpeg.wasm library
 */
export async function convertWebMToMP4(webmBlob: Blob): Promise<Blob | null> {
  // TODO: Implement FFmpeg.wasm conversion
  // For now, return the WebM blob as-is
  console.warn('MP4 conversion not yet implemented, returning WebM')
  return webmBlob
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}