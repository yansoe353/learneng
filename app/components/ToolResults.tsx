import React from 'react';

interface ToolResultsProps {
  speechAnalysis?: {
    expressionUsage?: string;
    communicationStyle?: string;
  };
  corrections?: Array<{
    original: string;
    type: string;
    improvement: string;
    explanation: string;
  }>;
}

const ToolResults: React.FC<ToolResultsProps> = ({ speechAnalysis, corrections = [] }) => {
  if (!speechAnalysis && !corrections.length) return null;

  return (
    <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm">
      {speechAnalysis && (
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Speech Analysis
          </h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {speechAnalysis.expressionUsage && (
              <p>Expression: {speechAnalysis.expressionUsage}</p>
            )}
            {speechAnalysis.communicationStyle && (
              <p>Style: {speechAnalysis.communicationStyle}</p>
            )}
          </div>
        </div>
      )}
      
      {corrections.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Suggested Improvements
          </h3>
          <div className="space-y-2">
            {corrections.map((correction, index) => (
              <div key={index} className="text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Original: <span className="text-gray-700 dark:text-gray-300">{correction.original}</span>
                </p>
                <p className="text-green-600 dark:text-green-400">
                  Improvement: {correction.improvement}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {correction.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolResults; 