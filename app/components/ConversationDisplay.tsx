import React, { forwardRef, useRef } from 'react';
import { Transcript } from 'ultravox-client';

// 首先定义 ToolResults 接口
interface SpeechAnalysisItem {
  text: string;
  score: number;
  feedback: string;
  category?: string;
}

interface ErrorCorrectionItem {
  text: string;
  type: string;
  correction: string;
  explanation?: string;
}

interface ToolResults {
  speechAnalysis?: SpeechAnalysisItem[];
  corrections?: ErrorCorrectionItem[];
}

// 更新 props 接口
interface ConversationDisplayProps {
  transcript: Transcript[] | null;
  currentText: string;
  toolResults: ToolResults;  // 添加 toolResults
  children?: React.ReactNode;
}

const ConversationDisplay = forwardRef<HTMLDivElement, ConversationDisplayProps>(
  ({ transcript, currentText, toolResults }, ref) => {
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