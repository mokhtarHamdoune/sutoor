# Image Node Components

This directory contains all components related to rendering images in the Lexical editor.

## 📁 Structure

```
image-node/
├── index.tsx                  ← Main ImageComponent (default export)
├── lazy-image.tsx             ← LazyImage component with suspense
├── broken-image.tsx           ← Error state placeholder
├── image-resizer.tsx          ← Resize handles (re-exported from parent)
├── use-suspense-image.ts      ← Image preloading hook
└── README.md                  ← This file
```

## 🔄 Data Flow

```
ImageNode (Lexical)
       ↓
index.tsx (ImageComponent)
       ↓
   ┌───┴───┐
   ↓       ↓
LazyImage  ImageResizer
   ↓
useSuspenseImage (hook)
   ↓
BrokenImage (if error)
```

## 🔧 Future Improvements

- [x] Move ImageResizer.tsx into this directory
- [ ] Add tests for each component
- [ ] Extract image caching to a separate service
- [ ] Add image optimization/compression
- [ ] Support for image alignment (left/center/right)
