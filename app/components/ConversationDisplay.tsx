import React, { forwardRef, useEffect } from 'react';
import { Transcript } from 'ultravox-client';

interface ConversationDisplayProps {
  transcript: Transcript[] | null;
  currentText: string;
}

const ConversationDisplay = forwardRef<HTMLDivElement, ConversationDisplayProps>(
  ({ transcript, currentText }, ref) => {
    useEffect(() => {
      if (ref && typeof ref !== 'function') {
        const element = ref.current;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      }
    }, [transcript]);

    return (
      <div 
        ref={ref}
        className="h-[500px] p-6 overflow-y-auto relative"
      >
        {transcript?.map((item, index) => {
          const isLatest = index === (transcript.length - 1);
          return (
            <div 
              key={index}
              className={`mb-6 transition-all duration-300 ${
                isLatest 
                  ? 'opacity-100' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                {item.speaker === 'agent' ? "AI" : "You"}
              </p>
              <p className={`${
                isLatest 
                  ? 'text-gray-900 dark:text-white text-lg' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
);

ConversationDisplay.displayName = 'ConversationDisplay';

export default ConversationDisplay; 