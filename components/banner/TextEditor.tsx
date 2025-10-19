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
    <Card>
      <CardHeader>
        <CardTitle>Text Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            placeholder="Enter headline text..."
            value={headline}
            onChange={(e) => onHeadlineChange(e.target.value)}
            className="font-semibold"
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
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}