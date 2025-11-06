# Photon Gallery

A beautiful, responsive image gallery built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Grid Layout**: Responsive image grid that adapts to different screen sizes
- **New Tab Opening**: Click any image to open full-size version in new window/tab
- **Loading States**: Elegant loading indicators for images
- **Error Handling**: Graceful fallback for failed image loads
- **Dark Mode Support**: Automatic dark/light theme detection
- **Smooth Animations**: Hover effects and transitions
- **File Information**: Display image name, size, and modification date

## Component Structure

```
app/
├── componnets/
│   ├── ImageGrid.tsx          # Grid display of image thumbnails
│   └── LoadingSpinner.tsx     # Reusable loading component
├── types/
│   └── image.ts               # TypeScript interfaces
├── data/
│   └── mockData.ts            # Sample image data
└── page.tsx                   # Main page component
```

## Image Data Structure

The application expects image data in the following format:

```typescript
interface ImageData {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string;    // Used for grid display
  modifiedTime: string;     // ISO date string
  size: string;             // File size in bytes
  previewUrl: string;       // Used for full-size display
}
```

## Usage

1. **Grid View**: Images are displayed in a responsive grid
2. **Click to Open**: Click any image to open the full-size version in a new tab/window
3. **Browse**: Use the new tab to view the image at full resolution
4. **Return**: Close the tab or switch back to continue browsing

## Responsive Design

- **Mobile**: Single column grid
- **Tablet**: 2-3 columns
- **Desktop**: 4-5 columns based on screen width
- **Large Screens**: Up to 5 columns maximum

## Image Optimization

- Uses Next.js Image component for automatic optimization
- Responsive image sizes for different viewports
- Lazy loading for better performance
- Proper error handling for failed image loads

## External Image Configuration

The app is configured to handle images from:
- Google Drive (`lh3.googleusercontent.com` and `drive.google.com`)
- Unsplash (`images.unsplash.com`)

To add more image sources, update the `remotePatterns` in `next.config.ts`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

To integrate with a real API, replace the mock data in `app/data/mockData.ts` with an API call in your page component:

```typescript
useEffect(() => {
  const fetchImages = async () => {
    const response = await fetch('/api/images');
    const imageData = await response.json();
    setImages(imageData);
  };
  
  fetchImages();
}, []);
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
