# Banner Maker

A Next.js application for creating professional marketing banners with ease. Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 **Live Preview** - See your banner update in real-time as you edit
- 📝 **Simple Text Editing** - Edit headline and description text with clean form inputs
- 🖼️ **Background Selection** - Choose from 5 preset background images
- 💾 **Export Options** - Download as PNG or WebP format
- 📏 **Fixed Dimensions** - Exports at 1200×650px (perfect for social media banners)
- 🎯 **No Design Skills Required** - Simple interface for marketing teams
- ⚡ **Instant Generation** - Create banners in seconds, not minutes

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible UI components
- **HTML5 Canvas** - Banner rendering and export
- **lucide-react** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd bannermaker
```

2. Install dependencies:
```bash
npm install
```

3. Add your background images:
   - Place 5 background images (1200×650px) in `public/backgrounds/`
   - Name them: `bg1.jpg`, `bg2.jpg`, `bg3.jpg`, `bg4.jpg`, `bg5.jpg`
   - Update names in `components/banner/BannerEditor.tsx` if needed

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Text**: Type your headline and description in the left panel
2. **Choose Background**: Select a background from the dropdown menu
3. **Preview**: See your banner update live on the right panel
4. **Export**: Click "Export as PNG" or "Export as WebP" to download

## Project Structure

```
bannermaker/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   └── label.tsx
│   └── banner/               # Banner-specific components
│       ├── BannerEditor.tsx  # Main editor component
│       ├── BannerCanvas.tsx  # Canvas rendering logic
│       ├── TextEditor.tsx    # Text input form
│       └── BackgroundSelector.tsx
├── public/
│   └── backgrounds/          # Background images
│       ├── bg1.jpg
│       ├── bg2.jpg
│       ├── bg3.jpg
│       ├── bg4.jpg
│       └── bg5.jpg
└── lib/
    └── utils.ts              # Utility functions
```

## Customization

### Changing Banner Dimensions

Edit the constants in `components/banner/BannerCanvas.tsx`:
```typescript
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 650
```

### Adjusting Text Positioning

Modify the position constants in `components/banner/BannerCanvas.tsx`:
```typescript
const LOGO_POSITION = { x: 145, y: 170 }
const HEADLINE_POSITION = { x: 145, y: 350 }
const SUBTEXT_POSITION = { x: 145, y: 420 }
```

### Changing Typography

Update font settings in `components/banner/BannerCanvas.tsx`:
```typescript
const HEADLINE_FONT = "bold 48px Inter, system-ui, -apple-system, sans-serif"
const SUBTEXT_FONT = "400 24px Inter, system-ui, -apple-system, sans-serif"
```

### Adding More Backgrounds

Edit the `DEFAULT_BACKGROUNDS` array in `components/banner/BannerEditor.tsx`:
```typescript
const DEFAULT_BACKGROUNDS: BackgroundOption[] = [
  { id: '1', name: 'Tech Grid', path: '/backgrounds/bg1.jpg' },
  // Add more backgrounds here
]
```

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

This Next.js app can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any platform supporting Next.js

## License

MIT

## Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ for marketing teams everywhere**
