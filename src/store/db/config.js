// src/store/db/config.js
export const DB_NAME = 'ytCatalogDB';
export const DB_VERSION = 1;

export const STORES = {
  CHANNELS: 'channels',
  TAGS: 'tags'
};

export const INDEXES = {
  CHANNELS: {
    TITLE: 'title',
    SUBSCRIBER_COUNT: 'subscriberCount',
    VIEW_COUNT: 'viewCount',
    VIDEO_COUNT: 'videoCount',
    LAST_UPDATED: 'lastUpdated'
  },
  TAGS: {
    TAG: 'tag',
    CHANNEL_ID: 'channelId'
  }
};