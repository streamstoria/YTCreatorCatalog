// src/store/__tests__/store.test.js
import { describe, it, expect } from 'vitest';
import { useStorage } from '../index';
import { mockChannel, mockTags } from './utils';
import { tagsStore } from '../tags';

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

  describe('Tag Management', () => {
    it('should add a new tag to channel', async () => {
      // First save a channel with initial tags
      const channelWithTags = {
        ...mockChannel,
        tags: ['initial-tag']
      };
      await store.saveChannelData(channelWithTags);

      // Add a new tag
      const newTag = 'new-tag';
      await store.addTagToChannel(mockChannel.channelId, newTag);

      // Verify the tag was added
      const updatedChannel = await store.getChannelById(mockChannel.channelId);
      expect(updatedChannel.tags).toContain(newTag);
      expect(updatedChannel.tags).toContain('initial-tag');
    });

    it('should not duplicate existing tags', async () => {
      // Save channel with a tag
      const initialTag = 'test-tag';
      await store.saveChannelData({
        ...mockChannel,
        tags: [initialTag]
      });

      // Try to add the same tag again
      await store.addTagToChannel(mockChannel.channelId, initialTag);

      // Verify no duplication
      const channel = await store.getChannelById(mockChannel.channelId);
      expect(channel.tags.filter(tag => tag === initialTag)).toHaveLength(1);
    });

    it('should remove a tag from channel', async () => {
      // Save channel with tags
      const initialTags = ['tag1', 'tag2', 'tag3'];
      await store.saveChannelData({
        ...mockChannel,
        tags: initialTags
      });

      // Remove one tag
      await store.removeTagFromChannel(mockChannel.channelId, 'tag2');

      // Verify the tag was removed
      const updatedChannel = await store.getChannelById(mockChannel.channelId);
      expect(updatedChannel.tags).not.toContain('tag2');
      expect(updatedChannel.tags).toHaveLength(2);
      expect(updatedChannel.tags).toContain('tag1');
      expect(updatedChannel.tags).toContain('tag3');
    });
  });

  describe('Notes Management', () => {
    it('should update channel notes', async () => {
      // Save initial channel
      await store.saveChannelData(mockChannel);

      // Update notes
      const newNotes = 'These are updated notes';
      await store.updateChannelNotes(mockChannel.channelId, newNotes);

      // Verify notes were updated
      const updatedChannel = await store.getChannelById(mockChannel.channelId);
      expect(updatedChannel.notes).toBe(newNotes);
    });

    it('should handle empty notes', async () => {
      // Save channel with notes
      await store.saveChannelData({
        ...mockChannel,
        notes: 'Initial notes'
      });

      // Update with empty notes
      await store.updateChannelNotes(mockChannel.channelId, '');

      // Verify empty notes were saved
      const updatedChannel = await store.getChannelById(mockChannel.channelId);
      expect(updatedChannel.notes).toBe('');
    });

    it('should throw error when updating notes for non-existent channel', async () => {
      await expect(
        store.updateChannelNotes('non-existent-id', 'some notes')
      ).rejects.toThrow('Channel not found');
    });
  });
});

describe('Channel List Management', () => {
  const store = useStorage();

  it('should get all channels as a map', async () => {
    // Save multiple channels
    const channels = [
      {
        ...mockChannel,
        channelId: 'channel1',
        title: 'Channel 1',
        tags: ['tag1', 'tag2']
      },
      {
        ...mockChannel,
        channelId: 'channel2',
        title: 'Channel 2',
        tags: ['tag2', 'tag3']
      }
    ];

    await Promise.all(channels.map(channel => store.saveChannelData(channel)));

    // Get channels map
    const channelsMap = await store.getChannelsMap();

    // Verify map structure
    expect(Object.keys(channelsMap)).toHaveLength(2);
    expect(channelsMap.channel1.title).toBe('Channel 1');
    expect(channelsMap.channel2.title).toBe('Channel 2');

    // Verify tags are included
    expect(channelsMap.channel1.tags).toContain('tag1');
    expect(channelsMap.channel2.tags).toContain('tag3');
  });

  it('should remove channel and its tags', async () => {
    // Save a channel with tags
    const channel = {
      ...mockChannel,
      channelId: 'channel-to-remove',
      tags: ['tag1', 'tag2']
    };
    await store.saveChannelData(channel);

    // Remove the channel
    await store.removeChannel(channel.channelId);

    // Verify channel is removed
    const deletedChannel = await store.getChannelById(channel.channelId);
    expect(deletedChannel).toBeNull();

    // Verify no tags remain
    const remainingTags = await tagsStore.getChannelTags(channel.channelId);
    expect(remainingTags).toHaveLength(0);
  });

  it('should handle empty channel list', async () => {
    const channelsMap = await store.getChannelsMap();
    expect(channelsMap).toEqual({});
  });

  it('should handle removing non-existent channel', async () => {
    // Should not throw error
    await expect(store.removeChannel('non-existent-id')).resolves.not.toThrow();
  });
});