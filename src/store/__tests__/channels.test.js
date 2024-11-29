// src/store/__tests__/channels.test.js
import { describe, it, expect } from 'vitest';
import { channelsStore } from '../channels';
import { getAllFromStore } from './utils';
import { STORES } from '../db/config';
import { mockChannel } from './utils';

describe('ChannelsStore', () => {
  describe('saveChannel', () => {
    it('should save a channel successfully', async () => {
      // Save the channel
      const channelId = await channelsStore.saveChannel(mockChannel);
      
      // Verify the saved data
      const allChannels = await getAllFromStore(STORES.CHANNELS);
      expect(allChannels).toHaveLength(1);
      expect(allChannels[0].channelId).toBe(channelId);
      expect(allChannels[0].title).toBe(mockChannel.title);
      expect(allChannels[0].lastUpdated).toBeDefined();
    });

    it('should throw error when channelId is missing', async () => {
      const invalidChannel = { ...mockChannel, channelId: undefined };
      await expect(channelsStore.saveChannel(invalidChannel))
        .rejects.toThrow('Cannot save channel: channelId is required');
    });

    it('should update existing channel', async () => {
      // Save initial version
      await channelsStore.saveChannel(mockChannel);
      
      // Update the channel
      const updatedChannel = {
        ...mockChannel,
        title: 'Updated Title'
      };
      await channelsStore.saveChannel(updatedChannel);
      
      // Verify the update
      const allChannels = await getAllFromStore(STORES.CHANNELS);
      expect(allChannels).toHaveLength(1);
      expect(allChannels[0].title).toBe('Updated Title');
    });
  });

  describe('getChannel', () => {
    it('should retrieve a saved channel', async () => {
      // Save a channel first
      await channelsStore.saveChannel(mockChannel);
      
      // Retrieve the channel
      const retrievedChannel = await channelsStore.getChannel(mockChannel.channelId);
      
      // Verify the retrieved data
      expect(retrievedChannel).toBeDefined();
      expect(retrievedChannel.channelId).toBe(mockChannel.channelId);
      expect(retrievedChannel.title).toBe(mockChannel.title);
    });

    it('should return null for non-existent channel', async () => {
      const channel = await channelsStore.getChannel('non-existent-id');
      expect(channel).toBeNull();
    });
  });
});