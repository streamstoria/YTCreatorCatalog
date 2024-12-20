# YT Creator Catalog Browser Extension

A browser extension that allows users to bookmark YouTube channels and add tags and notes to them. The extension collects channel statistics and top videos, providing a searchable catalog of bookmarked creators.

## Supported Browsers
- Google Chrome
- Mozilla Firefox
- Microsoft Edge

## Features
- Bookmark YouTube channels directly from their pages
- Add tags and notes to bookmarked channels
- View channel statistics (subscribers, views, video count)
- Track top videos from each channel
- Search and sort bookmarked channels
- Manage bookmarks through a dedicated extension page

## Build Requirements

### Operating System
- Any OS that supports Node.js (Windows, macOS, Linux)

### Development Environment
- Node.js version 16.0.0 or higher
- pnpm version 8.0.0 or higher (recommended) or npm

### Build Dependencies
All dependencies are listed in `package.json` and will be installed automatically during the build process.

## Build Instructions

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd YTCreatorCatalog
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   # or using npm
   npm install
   ```

3. **Build for All Browsers**
   ```bash
   pnpm run build
   # or using npm
   npm run build
   ```

   This will create three directories:
   - `dist-chrome/` - Chrome build
   - `dist-firefox/` - Firefox build
   - `dist-edge/` - Edge build



### Browser-Specific Builds

If you want to build for a specific browser only:

```bash
# For Chrome
pnpm run build:chrome

# For Firefox
pnpm run build:firefox

# For Edge
pnpm run build:edge
```

## Source Code Structure

### Key Directories
- `src/` - Main source code
  - `assets/` - Static assets and icons
  - `background/` - Background script
  - `content/` - Content scripts and components
  - `manage/` - Management interface pages
  - `popup/` - Extension popup
  - `store/` - Data storage implementation
- `scripts/` - Build and packaging scripts

### Important Files
- `manifest.json` - Chrome/Edge manifest (V3)
- `manifest.firefox.json` - Firefox-specific manifest (V2)
- `vite.config.js` - Main build configuration
- `vite.firefox-content.config.js` - Firefox content script config
- `vite.firefox-background.config.js` - Firefox background script config

## Technical Implementation

### Storage
- Uses IndexedDB for persistent storage
- Two main stores:
  - `channels`: Stores channel data and metadata
  - `tags`: Stores channel tags with relationships

### Architecture
- Hybrid architecture for data storage and access
- Content scripts inject bookmark functionality into YouTube pages
- Background script handles data management
- Vue.js components for user interface
- TailwindCSS for styling

## Testing

Run the test suite:
```bash
pnpm test
# or
npm test
```

