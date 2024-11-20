import React, { forwardRef, useRef } from 'react';
import { Transcript } from 'ultravox-client';
import { ToolResults, SpeechAnalysisItem, ErrorCorrectionItem } from '@/lib/types';

// 更新 props 接口
interface ConversationDisplayProps {
  transcript: Transcript[] | null;
  currentText: string;
  toolResults: ToolResults;
  children?: React.ReactNode;
}

const ConversationDisplay = forwardRef<HTMLDivElement, ConversationDisplayProps>(
  ({ transcript, currentText, toolResults }, ref) => {
    const latestMessageRef = useRef<HTMLDivElement>(null);

    // 添加日志来查看传入的数据
    console.log('ConversationDisplay received toolResults:', toolResults);

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

                {/* 语音分析原始数据 */}
                {isLatest && toolResults.speechAnalysis && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">语音分析</h3>
                    {(toolResults.speechAnalysis as string[]).map((analysisStr, idx) => {
                      try {
                        const parsedArray = JSON.parse(analysisStr);  // 第一次解析得到数组
                        const analysis = parsedArray[0];  // 获取数组中的第一个对象
                        
                        return (
                          <div key={idx} className="p-2 border-b border-blue-100 dark:border-blue-800">
                            <p className="font-medium">原文: {analysis.text}</p>
                            <p>评分: {analysis.score}</p>
                            <p>反馈: {analysis.feedback}</p>
                            <p>类别: {analysis.category}</p>
                          </div>
                        );
                      } catch (e) {
                        console.error('解析失败:', e);
                        return <div key={idx}>解析错误</div>;
                      }
                    })}
                  </div>
                )}

                {/* 错误纠正原始数据 */}
                {isLatest && toolResults.corrections && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">语言纠正</h3>
                    {(toolResults.corrections as string[]).map((correctionStr, idx) => {
                      try {
                        const parsedArray = JSON.parse(correctionStr);  // 第一次解析得到数组
                        const correction = parsedArray[0];  // 获取数组中的第一个对象
                        
                        return (
                          <div key={idx} className="p-2 border-b border-yellow-100 dark:border-yellow-800">
                            <p className="font-medium">原文: {correction.text}</p>
                            <p>纠正: {correction.correction}</p>
                            <p>说明: {correction.explanation}</p>
                            <p>类型: {correction.type}</p>
                          </div>
                        );
                      } catch (e) {
                        console.error('解析失败:', e);
                        return <div key={idx}>解析错误</div>;
                      }
                    })}
                  </div>
                )}
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