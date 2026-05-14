import React from 'react';
import { useSelector } from 'react-redux';
import { Hash, Plus, Lock } from 'lucide-react';
import ChannelItem from './ChannelItem';

const ChannelList = ({ onSelectChannel, onCreateChannel }) => {
  const { channels, loading } = useSelector((state) => state.workspace);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Channels
        </h2>
        <button
          onClick={onCreateChannel}
          className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="px-2 space-y-1">
        {channels.length > 0 ? (
          channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              onClick={() => onSelectChannel(channel)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-light-muted dark:text-dark-muted text-sm">No channels found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelList;
