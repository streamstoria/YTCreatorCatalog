// src/store/__tests__/store.test.js
import { describe, it, expect } from 'vitest';
import { useStorage } from '../index';
import { mockChannel, mockTags } from './utils';

describe('Store Integration', () => {
  const store = useStorage();

  describe('saveChannelData and getChannelById', () => {
    it('should save and retrieve complete channel data including videos array', async () => {
      // Prepare complete channel data
      const completeChannel = {
        ...mockChannel,
        tags: mockTags,
        notes: 'Test channel notes',
        videos: [
          {
            title: 'First Video',
            url: 'https://youtube.com/watch?v=123',
            views: 1000,
            postedDate: '2023-01-01T00:00:00.000Z',
            metadata: {
              rawViews: '1K views',
              rawPostedDate: '2 months ago'
            }
          },
          {
            title: 'Second Video',
            url: 'https://youtube.com/watch?v=456',
            views: 2000,
            postedDate: '2023-02-01T00:00:00.000Z',
            metadata: {
              rawViews: '2K views',
              rawPostedDate: '1 month ago'
            }
          }
        ]
      };
      
      // Save the channel
      await store.saveChannelData(completeChannel);
      
      // Retrieve the channel
      const retrievedChannel = await store.getChannelById(completeChannel.channelId);
      
      // Verify basic channel data
      expect(retrievedChannel).toBeDefined();
      expect(retrievedChannel.channelId).toBe(completeChannel.channelId);
      expect(retrievedChannel.title).toBe(completeChannel.title);
      expect(retrievedChannel.notes).toBe(completeChannel.notes);
      
      // Verify tags
      expect(retrievedChannel.tags).toEqual(expect.arrayContaining(mockTags));
      expect(Array.isArray(retrievedChannel.tags)).toBe(true);
      
      // Verify videos array
      expect(Array.isArray(retrievedChannel.videos)).toBe(true);
      expect(retrievedChannel.videos).toHaveLength(2);
      
      // Verify video objects
      retrievedChannel.videos.forEach((video, index) => {
        expect(video).toEqual(completeChannel.videos[index]);
        expect(video.title).toBeDefined();
        expect(video.url).toBeDefined();
        expect(video.views).toBeTypeOf('number');
        expect(video.postedDate).toBeDefined();
        expect(video.metadata).toBeDefined();
      });
      
      // Verify lastUpdated
      expect(retrievedChannel.lastUpdated).toBeDefined();
      expect(new Date(retrievedChannel.lastUpdated)).toBeInstanceOf(Date);
    });
  });
  
  describe('saveChannelData and getChannelById', () => {
    it('should save and retrieve channel with tags', async () => {
      // Save channel with tags
      const channelWithTags = {
        ...mockChannel,
        tags: mockTags
      };
      
      await store.saveChannelData(channelWithTags);
      
      // Retrieve the channel
      const retrievedChannel = await store.getChannelById(mockChannel.channelId);
      
      // Verify all data
      expect(retrievedChannel).toBeDefined();
      expect(retrievedChannel.channelId).toBe(mockChannel.channelId);
      expect(retrievedChannel.title).toBe(mockChannel.title);
      expect(retrievedChannel.tags).toEqual(expect.arrayContaining(mockTags));
      expect(retrievedChannel.lastUpdated).toBeDefined();
    });

    it('should handle channel update with new tags', async () => {
      // Save initial version
      await store.saveChannelData({
        ...mockChannel,
        tags: mockTags
      });
      
      // Update with new tags
      const newTags = ['newTag1', 'newTag2'];
      await store.saveChannelData({
        ...mockChannel,
        title: 'Updated Title',
        tags: newTags
      });
      
      // Verify the update
      const updated = await store.getChannelById(mockChannel.channelId);
      expect(updated.title).toBe('Updated Title');
      expect(updated.tags).toEqual(expect.arrayContaining(newTags));
      expect(updated.tags).toHaveLength(newTags.length);
    });

    it('should return null for non-existent channel', async () => {
      const channel = await store.getChannelById('non-existent-id');
      expect(channel).toBeNull();
    });
  });
});