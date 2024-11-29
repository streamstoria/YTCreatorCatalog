// src/store/db/schema.js
import { STORES, INDEXES } from './config';

export function setupDatabase(db) {
  // Channels store
  const channelsStore = db.createObjectStore(STORES.CHANNELS, { 
    keyPath: 'channelId' 
  });
  
  // Channel indexes
  channelsStore.createIndex(
    INDEXES.CHANNELS.TITLE,
    INDEXES.CHANNELS.TITLE,
    { unique: false }
  );
  channelsStore.createIndex(
    INDEXES.CHANNELS.SUBSCRIBER_COUNT,
    INDEXES.CHANNELS.SUBSCRIBER_COUNT,
    { unique: false }
  );
  channelsStore.createIndex(
    INDEXES.CHANNELS.VIEW_COUNT,
    INDEXES.CHANNELS.VIEW_COUNT,
    { unique: false }
  );
  channelsStore.createIndex(
    INDEXES.CHANNELS.VIDEO_COUNT,
    INDEXES.CHANNELS.VIDEO_COUNT,
    { unique: false }
  );
  channelsStore.createIndex(
    INDEXES.CHANNELS.LAST_UPDATED,
    INDEXES.CHANNELS.LAST_UPDATED,
    { unique: false }
  );

  // Tags store
  const tagsStore = db.createObjectStore(STORES.TAGS, { 
    keyPath: 'id',
    autoIncrement: true 
  });

  // Tag indexes
  tagsStore.createIndex(
    INDEXES.TAGS.TAG,
    INDEXES.TAGS.TAG,
    { unique: false }
  );
  tagsStore.createIndex(
    INDEXES.TAGS.CHANNEL_ID,
    INDEXES.TAGS.CHANNEL_ID,
    { unique: false }
  );
}