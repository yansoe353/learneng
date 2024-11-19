interface SpeakingIndicatorProps {
  agentStatus: string;
}

const SpeakingIndicator = ({ agentStatus }: SpeakingIndicatorProps) => {
  const isSpeaking = agentStatus === 'speaking';
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`
        h-2 w-2 rounded-full
        ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}
      `} />
      <span className="text-sm text-gray-600">
        {isSpeaking ? 'AI is speaking...' : 'AI is listening'}
      </span>
    </div>
  );
};

export default SpeakingIndicator; 