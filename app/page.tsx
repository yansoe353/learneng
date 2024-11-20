'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Role,                              // 用于定义角色（user/assistant）
  Transcript,                        // 对话记录类型
  UltravoxSessionStatus,             // 会话状态类型
  UltravoxExperimentalMessageEvent,    // 调试消息事件类型
  Medium
} from 'ultravox-client';
import { startCall, endCall } from '@/lib/callFunctions';
import demoConfig from './demo-config';
import MicToggleButton from './components/MicToggleButton';
import CallDuration from './components/CallDuration';
import SpeakingIndicator from './components/SpeakingIndicator';
import CallStatus from './components/CallStatus';
import ConversationDisplay from './components/ConversationDisplay';
import DebugMessages from './components/DebugMessages';
import { Sun, Moon } from 'lucide-react';
import ToolResults from './components/ToolResults';
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
  const [toolResults, setToolResults] = useState<{
    speechAnalysis?: {
      expressionUsage: string;
      communicationStyle: string;
    };
    corrections?: Array<{
      original: string;
      type: 'grammar' | 'vocabulary' | 'expression';
      improvement: string;
      explanation: string;
    }>;
  }>({});
  const [aiResponse, setAiResponse] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'ai' | 'user';
    message: string;
    timestamp: number;
  }>>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTo({
        top: transcriptContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [callTranscript]);

  const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
    if(status) {
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

  const handleDebugMessage = useCallback((message: UltravoxExperimentalMessageEvent) => {
    if (message.target && 'registeredTools' in message.target) {
      console.log('Registered Tools:', message.target.registeredTools);
    }
    
    setCallDebugMessages(prev => [...prev, message]);
    
    // 处理工具响应
    if (message.message?.type === 'tool_response') {
      const toolResponse = message.message;
      console.log('Tool Response:', toolResponse);
      
      switch (toolResponse.tool) {
        case 'speechAnalysis':
          const analysisData = toolResponse.response?.analysisData;
          if (analysisData?.analysis) {
            setToolResults(prev => ({
              ...prev,
              speechAnalysis: {
                text: analysisData.text,
                score: analysisData.score,
                feedback: analysisData.feedback,
                category: analysisData.category
              }
            }));
          }
          break;
          
        case 'errorCorrection':
          const correctionData = toolResponse.response?.correctionData;
          if (correctionData) {
            setToolResults(prev => ({
              ...prev,
              corrections: [{
                original: correctionData.text,
                type: correctionData.type as 'grammar' | 'vocabulary' | 'expression',
                improvement: correctionData.correction,
                explanation: correctionData.explanation
              }]
            }));
          }
          break;
      }
    }

    // 处理 LLM 响应
    if (message.message?.type === 'debug' && message.message.message?.startsWith('LLM response:')) {
      const responseText = message.message.message
        .replace('LLM response: ', '')
        .replace(/^"|"$/g, '');
      
      setCallTranscript(prev => {
        const newTranscript = new Transcript(
          responseText,
          true,
          Role.AGENT,
          Medium.TEXT
        );

        if (!prev) return [newTranscript];
        return [...prev, newTranscript];
      });
    }
  }, []);

  const startAudioCall = async () => {
    try {
      //console.log('Starting call with tools:', demoConfig.callConfig.selectedTools);
      
      const callbacks = {
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange,
        onDebugMessage: handleDebugMessage
      };

      await startCall(callbacks, demoConfig.callConfig, true);
      setIsCallActive(true);
      handleStatusChange('Call started successfully');
    } catch (error) {
      console.error('Failed to start call:', error);
      
      // 添加错误消息处理逻辑
      let userFriendlyMessage = 'An error occurred while starting the call';
      
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('402') || 
            errorMessage.includes('subscription') || 
            errorMessage.includes('set up your subscription')) {
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

  useEffect(() => {
    if (agentStatus) {
      setDebugMessages(prev => [...prev, `Agent Status: ${agentStatus}`]);
    }
  }, [agentStatus]);

  useEffect(() => {
    if (currentText) {
      setDebugMessages(prev => [...prev, `Message: ${currentText}`]);
    }
  }, [currentText]);

  useEffect(() => {
    console.log('callTranscript changed:', callTranscript);
  }, [callTranscript]);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  useEffect(() => {
    // 监听语音分析事件
    const handleSpeechAnalysis = (event: CustomEvent) => {
      console.log('收到语音分析事件:', event.detail);
      alert(`收到语音分析结果：\n${JSON.stringify(event.detail, null, 2)}`);
      setToolResults(prev => ({
        ...prev,
        speechAnalysis: event.detail
      }));
    };

    // 监听错误纠正事件
    const handleErrorCorrection = (event: CustomEvent) => {
      console.log('收到错误纠正事件:', event.detail);
      alert(`收到错误纠正结果：\n${JSON.stringify(event.detail, null, 2)}`);
      setToolResults(prev => ({
        ...prev,
        corrections: event.detail
      }));
    };

    // 添加事件监听器
    window.addEventListener('speechAnalysisUpdated', handleSpeechAnalysis as EventListener);
    window.addEventListener('errorCorrectionUpdated', handleErrorCorrection as EventListener);

    // 清理事件监听器
    return () => {
      window.removeEventListener('speechAnalysisUpdated', handleSpeechAnalysis as EventListener);
      window.removeEventListener('errorCorrectionUpdated', handleErrorCorrection as EventListener);
    };
  }, []);

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
            className={`flex-1 h-12 rounded-xl font-medium transition-all
              ${isCallActive 
                ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
              }`}
          >
            Start Conversation
          </button>
          <button
            onClick={stopAudioCall}
            disabled={!isCallActive}
            className={`flex-1 h-12 rounded-xl font-medium transition-all
              ${!isCallActive
                ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
              }`}
          >
            End Call
          </button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center space-x-2">
            <SpeakingIndicator agentStatus={agentStatus} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {agentStatus}
            </span>
          </div>
          {isCallActive && (
            <CallDuration duration={duration} />
          )}
        </div>
        
        {aiResponse && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI Assistant</p>
            <p className="text-gray-800 dark:text-gray-200">{aiResponse}</p>
          </div>
        )}
        
        <ToolStatusIndicator toolResults={toolResults} />
        
        <DebugMessages debugMessages={callDebugMessages} />
      </div>
    </main>
  );
}