import React from 'react';
import { useSelector } from 'react-redux';
import { Users, Plus } from 'lucide-react';
import GroupCard from './GroupCard';

const GroupList = ({ onSelectGroup, onCreateGroup }) => {
  const { groups, loading } = useSelector((state) => state.workspace);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
          <Users className="h-5 w-5" />
          Groups
        </h2>
        <button
          onClick={onCreateGroup}
          className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="px-2 space-y-1">
        {groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => onSelectGroup(group)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-light-muted dark:text-dark-muted text-sm">No groups found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
