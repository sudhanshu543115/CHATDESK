import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Camera, Save, Loader2 } from 'lucide-react';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Avatar from '@components/common/Avatar';

const ProfileSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Profile Settings</h2>
        <p className="text-light-muted dark:text-dark-muted">Update your personal information and how others see you.</p>
      </div>

      <div className="flex flex-col items-center gap-4 p-6 bg-light-surface dark:bg-dark-surface rounded-2xl border border-light-border dark:border-dark-border">
        <div className="relative group">
          <Avatar src={user?.avatar} size="xl" className="w-32 h-32" />
          <button className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8" />
          </button>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg">{user?.username}</h3>
          <p className="text-sm text-light-muted dark:text-dark-muted">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Input
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. John Doe"
          icon={User}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
