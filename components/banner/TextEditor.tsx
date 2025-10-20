'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TextEditorProps {
  headline: string
  subtext: string
  onHeadlineChange: (value: string) => void
  onSubtextChange: (value: string) => void
}

export function TextEditor({
  headline,
  subtext,
  onHeadlineChange,
  onSubtextChange,
}: TextEditorProps) {
  return (
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            placeholder="Enter headline text..."
            value={headline}
            onChange={(e) => onHeadlineChange(e.target.value)}
            className="font-semibold p-5 bg-white focus:bg-white active:bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtext">Description</Label>
          <Textarea
            id="subtext"
            placeholder="Enter description text..."
            value={subtext}
            onChange={(e) => onSubtextChange(e.target.value)}
            rows={4}
            className="resize-none p-5 py-4 bg-white focus:bg-white active:bg-white min-h-[80px]"
          />
        </div>
      </CardContent>
  )
}