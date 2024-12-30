'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Role, Transcript, UltravoxSessionStatus, UltravoxExperimentalMessageEvent } from 'ultravox-client'; 
import { ToolResults, SpeechAnalysisItem, ErrorCorrectionItem } from '@/lib/types';
import { startCall, endCall } from '@/lib/callFunctions';
import demoConfig from './demo-config';
import MicToggleButton from './components/MicToggleButton';
import CallDuration from './components/CallDuration';
import SpeakingIndicator from './components/SpeakingIndicator';
import CallStatus from './components/CallStatus';
import ConversationDisplay from './components/ConversationDisplay';
import DebugMessages from './components/DebugMessages';
import { Sun, Moon } from 'lucide-react';
import ToolStatusIndicator from './components/ToolStatusIndicator';

export default function App() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('off');
  const [currentText, setCurrentText] = useState('');
  const [duration, setDuration] = useState(0);
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [corrections, setCorrections] = useState<string[]>([]);
  const [debugMessages, setDebugMessages] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [toolResults, setToolResults] = useState<ToolResults>({});
  const [aiResponse, setAiResponse] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'ai' | 'user'; message: string; timestamp: number }>>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);

  // New state for form inputs
  const [apiKey, setApiKey] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [callTranscript]);

  const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
    if (status) {
      setAgentStatus(status);
    } else {
      setAgentStatus('off');
    }
  }, []);

  const handleTranscriptChange = useCallback((transcripts: Transcript[] | undefined) => {
    if (transcripts) {
      const transcriptsWithMeta = transcripts.map((t, index) => ({
        ...t,
        isLatest: index === transcripts.length - 1
      }));
      setCallTranscript(transcriptsWithMeta);
    }
  }, []);

  const startAudioCall = async () => {
    try {
      const callbacks = {
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange,
      };

      await startCall(callbacks, demoConfig.callConfig, true);
      setIsCallActive(true);
      handleStatusChange('Call started successfully');
    } catch (error) {
      console.error('Failed to start call:', error);
      let userFriendlyMessage = 'An error occurred while starting the call';

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('402') || errorMessage.includes('subscription')) {
          userFriendlyMessage = 'The conversation limit has been reached. Please contact the administrator to continue using.';
        } else if (errorMessage.includes('500')) {
          userFriendlyMessage = 'The server is temporarily unable to respond. Please try again later.';
        }
      }

      handleStatusChange(userFriendlyMessage);
    }
  };

  const stopAudioCall = async () => {
    try {
      handleStatusChange('Ending call...');
      await endCall();
      setIsCallActive(false);
      setDuration(0);
      handleStatusChange('Call ended successfully');
    } catch (error) {
      console.error('Error ending call:', error);
      handleStatusChange(`Error ending call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleToggle = () => {
    if (isCallActive) {
      stopAudioCall();
    } else {
      startAudioCall();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCallActive) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCallActive]);

  const handleApiKeySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiKey) {
      setFormError("API key is required.");
      return;
    }
    // handle API Key submission logic here
    console.log('API Key submitted:', apiKey);
    setFormError(null); // Clear any previous error
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Winko.AI English Partner
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
              Your AI-powered language learning companion
            </p>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* API Key Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Enter Your API Key</h2>
            <input
              type="text"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-gray-800 dark:text-white"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg w-full">
              Submit API Key
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
          <ConversationDisplay
            ref={transcriptContainerRef}
            transcript={callTranscript}
            currentText={currentText}
            toolResults={toolResults}
          >
            {chatHistory.map((chat, index) => (
              <div
                key={chat.timestamp}
                className={`mb-4 transition-opacity duration-200 ${
                  index === chatHistory.length - 1
                    ? 'text-gray-200'
                    : 'text-gray-400'
                }`}
              >
                <p className="text-sm font-medium">
                  {chat.role === 'ai' ? 'AI Assistant' : 'You'}
                </p>
                <p className="mt-1">{chat.message}</p>
              </div>
            ))}
          </ConversationDisplay>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleToggle}
            disabled={isCallActive}
            className="bg-blue-500 text-white p-2 rounded-lg flex-1 transition-all duration-300 hover:bg-blue-400 disabled:opacity-50"
          >
            {isCallActive ? 'End Call' : 'Start Call'}
          </button>
          <MicToggleButton />
        </div>

        <DebugMessages messages={debugMessages} />

        {isCallActive && <CallStatus status={agentStatus} />}
        {isCallActive && <CallDuration duration={duration} />}
      </div>
    </main>
  );
}
