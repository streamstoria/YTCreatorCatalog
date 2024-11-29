// src/store/__tests__/tags.test.js
import { describe, it, expect } from 'vitest';
import { tagsStore } from '../tags';
import { getAllFromStore } from './utils';
import { STORES } from '../db/config';
import { mockChannel, mockTags } from './utils';

describe('TagsStore', () => {
  describe('saveChannelTags', () => {
    it('should save tags for a channel', async () => {
      await tagsStore.saveChannelTags(mockChannel.channelId, mockTags);
      
      const allTags = await getAllFromStore(STORES.TAGS);
      expect(allTags).toHaveLength(mockTags.length);
      expect(allTags.every(t => t.channelId === mockChannel.channelId)).toBe(true);
      expect(allTags.map(t => t.tag)).toEqual(expect.arrayContaining(mockTags));
    });

    it('should replace existing tags when saving', async () => {
      // Save initial tags
      await tagsStore.saveChannelTags(mockChannel.channelId, mockTags);
      
      // Save new tags
      const newTags = ['newTag1', 'newTag2'];
      await tagsStore.saveChannelTags(mockChannel.channelId, newTags);
      
      // Get all tags after the update
      const allTags = await getAllFromStore(STORES.TAGS);
      
      // Verify the results
      expect(allTags).toHaveLength(newTags.length);
      expect(allTags.map(t => t.tag).sort())
        .toEqual(newTags.sort());
    });

    it('should throw error when tags is not an array', async () => {
      await expect(tagsStore.saveChannelTags(mockChannel.channelId, 'not-an-array'))
        .rejects.toThrow('Tags must be an array');
    });
  });

  describe('getChannelTags', () => {
    it('should retrieve tags for a channel', async () => {
      // Save tags first
      await tagsStore.saveChannelTags(mockChannel.channelId, mockTags);
      
      // Retrieve the tags
      const retrievedTags = await tagsStore.getChannelTags(mockChannel.channelId);
      
      expect(retrievedTags.sort()).toEqual(mockTags.sort());
    });

    it('should return empty array for channel with no tags', async () => {
      const tags = await tagsStore.getChannelTags('non-existent-channel');
      expect(tags).toEqual([]);
    });
  });
});