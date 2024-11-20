import React from 'react';

interface ToolStatusIndicatorProps {
  toolResults: {
    speechAnalysis?: any;
    corrections?: any;
  };
}

const ToolStatusIndicator: React.FC<ToolStatusIndicatorProps> = ({ toolResults }) => {
  if (!toolResults.speechAnalysis && !toolResults.corrections) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {toolResults.speechAnalysis && (
        <div className="px-3 py-2 bg-gray-800/80 text-white rounded-lg text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Speech analysis completed</span>
        </div>
      )}
      {toolResults.corrections && (
        <div className="px-3 py-2 bg-gray-800/80 text-white rounded-lg text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Language correction provided</span>
        </div>
      )}
    </div>
  );
};

export default ToolStatusIndicator; 