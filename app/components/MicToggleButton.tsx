import React, { useState, useCallback } from 'react';
import { Role } from 'ultravox-client';
import { toggleMute } from '@/lib/callFunctions';
import { MicIcon, MicOffIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';

interface MicToggleButtonProps {
  role?: Role;
}

const MicToggleButton: React.FC<MicToggleButtonProps> = ({ role = Role.USER }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMic = useCallback(async () => {
    try {
      toggleMute(role);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  }, [isMuted, role]);

  const isUser = role === Role.USER;

  return (
    <button
      onClick={toggleMic}
      className={`
        relative inline-flex items-center justify-center p-4
        rounded-full shadow-lg transition-all duration-200
        ${isMuted 
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600' 
          : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500'
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900
      `}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      <div className="relative">
        {isMuted ? (
          <>
            {isUser ? (
              <MicOffIcon className="w-6 h-6" />
            ) : (
              <VolumeOffIcon className="w-6 h-6" />
            )}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </>
        ) : (
          <>
            {isUser ? (
              <MicIcon className="w-6 h-6" />
            ) : (
              <Volume2Icon className="w-6 h-6" />
            )}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </>
        )}
      </div>
      <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
    </button>
  );
};

export default MicToggleButton;