'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BackgroundOption {
  id: string
  name: string
  path: string
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
          <Label htmlFor="background">Choose Background</Label>
          <Select value={selectedBackground} onValueChange={onBackgroundChange}>
            <SelectTrigger id="background">
              <SelectValue placeholder="Select a background" />
            </SelectTrigger>
            <SelectContent>
              {backgrounds.map((bg) => (
                <SelectItem key={bg.id} value={bg.path}>
                  {bg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Background Preview */}
        {selectedBackground && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="relative w-full aspect-[1200/650] rounded-md overflow-hidden border border-gray-200">
              <img
                src={selectedBackground}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}