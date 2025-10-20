'use client'

import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Image from 'next/image'

interface BackgroundOption {
  id: string
  name: string
  path: string
  type: 'image' | 'video'
}

interface BackgroundSelectorProps {
  backgrounds: BackgroundOption[]
  selectedBackground: string
  onBackgroundChange: (value: string) => void
}

export function BackgroundSelector({
  backgrounds,
  selectedBackground,
  onBackgroundChange,
}: BackgroundSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Choose Background</Label>
          <div className="grid grid-cols-2 gap-3 p-1.5 pb-8 pt-4 -mx-1.5 overflow-y-auto max-h-[758px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {backgrounds.map((bg) => {
              const isSelected = selectedBackground === bg.path
              return (
                <button
                  key={bg.id}
                  onClick={() => onBackgroundChange(bg.path)}
                  className={`
                    relative w-full aspect-[1200/650] rounded-lg overflow-hidden
                    border-2 transition-all duration-200 cursor-pointer
                    hover:scale-[1.02] hover:shadow-lg
                    ${isSelected
                      ? 'border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800'
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
                  
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  
                  {/* Background name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white font-medium">{bg.name}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}