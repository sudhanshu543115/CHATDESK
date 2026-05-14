import React, { useState } from 'react';
import { Hash, Lock, Info } from 'lucide-react';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

const CreateChannelModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ 
      name: name.toLowerCase().replace(/\s+/g, '-'), 
      description, 
      isPrivate 
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a channel">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-light-muted dark:text-dark-muted">
          Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
        </p>

        <Input
          label="Name"
          placeholder="e.g. plan-budget"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={isPrivate ? Lock : Hash}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-light-text dark:text-dark-text flex items-center gap-2">
            Description
            <span className="text-xs text-light-muted dark:text-dark-muted font-normal">(optional)</span>
          </label>
          <textarea
            className="w-full rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border p-3 text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary outline-none transition-all"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div 
          className="flex items-center justify-between p-4 rounded-xl border border-light-border dark:border-dark-border cursor-pointer hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
          onClick={() => setIsPrivate(!isPrivate)}
        >
          <div className="flex gap-3">
            <div className="mt-1">
              {isPrivate ? <Lock className="h-5 w-5 text-primary" /> : <Hash className="h-5 w-5 text-light-muted dark:text-dark-muted" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-light-text dark:text-dark-text">Make private</p>
              <p className="text-xs text-light-muted dark:text-dark-muted">
                {isPrivate 
                  ? "Only invited users can see this channel."
                  : "Anyone in the workspace can view and join."}
              </p>
            </div>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isPrivate ? 'bg-primary' : 'bg-light-muted dark:bg-dark-muted'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isPrivate ? 'translate-x-4' : ''}`} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={!name}>Create Channel</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
