import React from 'react';

interface CallDurationProps {
  duration: number;
}

export default function CallDuration({ duration }: CallDurationProps) {
  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <div className="text-lg font-mono">
      {formatTime(duration)}
    </div>
  );
} 