import React, { useState } from 'react';
import { X, Users, Image as ImageIcon, Search } from 'lucide-react';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Avatar from '@components/common/Avatar';

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Mock users for selection
  const mockUsers = [
    { id: '1', username: 'john_doe', avatar: null },
    { id: '2', username: 'jane_smith', avatar: null },
    { id: '3', username: 'alex_wilson', avatar: null },
  ];

  const handleToggleMember = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, description, members: selectedMembers });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Group">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Identity */}
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 rounded-2xl bg-light-bg dark:bg-dark-bg border-2 border-dashed border-light-border dark:border-dark-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors group">
            <ImageIcon className="h-8 w-8 text-light-muted dark:text-dark-muted group-hover:text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <Input
              label="Group Name"
              placeholder="e.g. Design Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-light-text dark:text-dark-text">
            Description (Optional)
          </label>
          <textarea
            className="w-full rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border p-3 text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary outline-none transition-all"
            rows="2"
            placeholder="What's this group about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Member Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-light-text dark:text-dark-text">
            Add Members ({selectedMembers.length})
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-muted dark:text-dark-muted" />
            <input
              type="text"
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-sm outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-1">
            {mockUsers.map(user => (
              <div
                key={user.id}
                onClick={() => handleToggleMember(user.id)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg cursor-pointer transition-colors"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedMembers.includes(user.id) ? 'bg-primary border-primary' : 'border-light-border dark:border-dark-border'}`}>
                  {selectedMembers.includes(user.id) && <X className="h-3 w-3 text-white" />}
                </div>
                <Avatar src={user.avatar} size="sm" />
                <span className="text-sm text-light-text dark:text-dark-text">{user.username}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!name}>Create Group</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
