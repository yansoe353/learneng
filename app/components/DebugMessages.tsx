import React, { useState, useEffect, useRef } from "react";
import { UltravoxExperimentalMessageEvent } from "ultravox-client";
import ToggleSwitch from "@/app/components/ui/Toggle";

interface DebugMessagesProps {
  debugMessages: UltravoxExperimentalMessageEvent[];
}

const DebugMessages: React.FC<DebugMessagesProps> = ({ debugMessages }) => {
  const [messages, setMessages] = useState<UltravoxExperimentalMessageEvent[]>(
    []
  );
  const [showDebugMessages, setShowDebugMessages] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(debugMessages);
  }, [debugMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => {
    setShowDebugMessages(!showDebugMessages);
  };

  return (
    <div className="mb-4 flex flex-col max-w-[1206px] mx-auto w-full py-5 pr-[10px]">
      <div className="flex flex-row">
        <h2 className="text-lg font-mono mr-4">Debug View</h2>
        <ToggleSwitch
          id="toggleDebug"
          isOn={showDebugMessages}
          handleToggle={handleToggle}
        />
      </div>

      {showDebugMessages && debugMessages && debugMessages.length > 0 && (
        <div className="mt-4 border-b border-[#3A3B3F]">
          <div className="h-40">
            <div ref={scrollRef} className="h-full pr-2 scrollbar-visible">
              {messages.map((msg, index) => (
                <div key={index} className="text-sm mb-2">
                  {msg.message?.type === 'tool_response' && (
                    <div className="text-blue-500">
                      Tool Called: {msg.message.tool}
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(msg, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugMessages;
