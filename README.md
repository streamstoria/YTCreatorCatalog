# YT Creator Catalog Chrome Extension

A Chrome extension that allows users to bookmark YouTube channels and add tags and notes to them. The extension collects channel statistics and top videos, providing a searchable catalog of bookmarked creators.

## Features

- Bookmark YouTube channels directly from their pages
- Add tags and notes to bookmarked channels
- View channel statistics (subscribers, views, video count)
- Track top videos from each channel
- Search and sort bookmarked channels
- Manage bookmarks through a dedicated extension page

## Technical Implementation

### Architecture Overview

The extension uses a hybrid architecture to handle data storage and access across different contexts:

- **Extension Pages**: Direct IndexedDB access
- **Content Scripts**: Message-based access through background script
- **Background Script**: Acts as a bridge between content scripts and IndexedDB

This architecture was chosen to handle Chrome extension context isolation while maintaining efficient data access.

### Key Components

#### Storage Layer

- Uses IndexedDB for persistent storage
- Two main stores:
  - `channels`: Stores channel data and metadata
  - `tags`: Stores channel tags with relationships

The storage layer is implemented with two access patterns:
1. Direct access for extension pages (manage bookmarks)
2. Message-based access for content scripts (YouTube page)

#### Data Flow

```
Content Scripts (YouTube page)
  ↓ Messages
Background Script
  ↓ Direct Access
IndexedDB
  ↑ Direct Access
Extension Pages (Manage Bookmarks)
```

### Implementation Details

#### Store Implementation
- `src/store/index.js`: Main store implementation with IndexedDB operations
- `src/store/contentStore.js`: Message-based store for content scripts
- Both maintain the same interface for consistency

#### Background Script
- Acts as a proxy for content script store operations
- Handles message passing between content scripts and IndexedDB
- Located in `src/background/index.js`

#### Content Scripts
- Inject bookmark button on YouTube channel pages
- Use contentStore for all data operations
- Parse channel data and statistics
- Files:
  - `src/content/components/bookmarkInjector.js`
  - `src/content/components/BookmarkForm.vue`
  - `src/content/parsers/*.js`

#### Extension Pages
- Manage bookmarks interface
- Direct store access using IndexedDB
- Files:
  - `src/manage/pages/ChannelList.vue`
  - `src/manage/pages/ChannelDetails.vue`

### Technical Decisions

1. **Split Storage Access**
   - Why: Chrome extensions have different contexts with isolated storage
   - Solution: Hybrid approach using direct and message-based access
   - Benefit: Maintains performance while ensuring data consistency

2. **IndexedDB Usage**
   - Why: Need for structured data storage and querying
   - Benefit: Better performance and flexibility compared to chrome.storage

3. **Vue 3 + TailwindCSS**
   - Why: Modern reactive UI with utility-first styling
   - Benefits: 
     - Rapid development
     - Consistent styling
     - Small bundle size

### Project Structure

```
src/
├── assets/
├── background/
├── content/
│   ├── components/
│   ├── parsers/
│   └── utils/
├── manage/
│   ├── pages/
│   └── router.js
├── popup/
└── store/
    ├── contentStore.js
    └── index.js
```

### Testing

- Unit tests for store operations
- Test setup uses fake-indexeddb for database testing
- Files located in `src/store/__tests__/`

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Load unpacked extension from `dist` directory

## Future Considerations

1. **Performance Optimization**
   - Batch updates for multiple channels
   - Caching frequently accessed data

2. **Feature Expansion**
   - Channel categories
   - Export/Import functionality
   - Channel update notifications

3. **Technical Improvements**
   - Add integration tests
   - Implement offline support
   - Add data migration system