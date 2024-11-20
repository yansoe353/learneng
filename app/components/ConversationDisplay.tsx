import React, { forwardRef, useRef } from 'react';
import { Transcript } from 'ultravox-client';

interface ConversationDisplayProps {
  transcript: Transcript[] | null;
  currentText: string;
  children?: React.ReactNode;
}

const ConversationDisplay = forwardRef<HTMLDivElement, ConversationDisplayProps>(
  ({ transcript, currentText }, ref) => {
    const latestMessageRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={ref} className="h-[500px] p-6 overflow-y-auto relative">
        {transcript?.filter(item => item.speaker === 'agent').map((item, index, filteredArray) => {
          const isLatest = index === (filteredArray.length - 1);
          
          return (
            <div key={index}>
              <div 
                ref={isLatest ? latestMessageRef : null}
                className={`mb-6 transition-all duration-300 ${
                  isLatest ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  AI
                </p>
                <p className={`${
                  isLatest 
                    ? 'text-gray-900 dark:text-white text-lg' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

ConversationDisplay.displayName = 'ConversationDisplay';

export default ConversationDisplay; 