import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Settings, Check } from 'lucide-react';
import { setWorkspaces, setCurrentWorkspace } from '@store/slices/workspaceSlice';
import Avatar from '@components/common/Avatar';

const WorkspaceSwitcher = ({ onClose }) => {
  const dispatch = useDispatch();
  const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);

  return (
    <div className="absolute left-16 bottom-20 w-64 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4">
      <div className="p-4 border-b border-light-border dark:border-dark-border bg-light-bg/50 dark:bg-dark-bg/50">
        <h3 className="text-sm font-bold text-light-text dark:text-dark-text uppercase tracking-wider">Workspaces</h3>
      </div>

      <div className="flex-1 overflow-y-auto max-h-80 p-2 space-y-1">
        {workspaces.map((ws) => (
          <button
            key={ws.id}
            onClick={() => {
              dispatch(setCurrentWorkspace(ws));
              onClose?.();
            }}
            className={`
              w-full flex items-center gap-3 p-2 rounded-lg transition-all
              ${currentWorkspace?.id === ws.id 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-light-bg dark:hover:bg-dark-bg text-light-text dark:text-dark-text'
              }
            `}
          >
            <Avatar src={ws.avatar} alt={ws.name} size="sm" className="rounded-md" />
            <span className="flex-1 text-left text-sm font-medium truncate">{ws.name}</span>
            {currentWorkspace?.id === ws.id && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>

      <div className="p-2 border-t border-light-border dark:border-dark-border space-y-1">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg text-light-text dark:text-dark-text transition-all">
          <div className="w-8 h-8 rounded-md bg-light-bg dark:bg-dark-bg border border-dashed border-light-border dark:border-dark-border flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Add Workspace</span>
        </button>
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg text-light-text dark:text-dark-text transition-all">
          <div className="w-8 h-8 rounded-md bg-light-bg dark:bg-dark-bg flex items-center justify-center">
            <Settings className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Manage Workspaces</span>
        </button>
      </div>
    </div>
  );
};

export default WorkspaceSwitcher;
