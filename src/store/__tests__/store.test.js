// src/store/__tests__/store.test.js
import { describe, it, expect } from 'vitest';
import { useStorage } from '../index';
import { mockChannel, mockTags } from './utils';

describe('Store Integration', () => {
  const store = useStorage();

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