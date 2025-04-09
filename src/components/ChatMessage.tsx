import React from 'react';
import { Bot, User, Volume2 } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  theme: any;
  onPlay?: (content: string) => void;
}

export function ChatMessage({ message, theme, onPlay }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'} animate-fade-in`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transform transition-transform hover:scale-110 ${
        isBot ? 
        'bg-gradient-to-br from-pink-400 to-pink-300 text-white' : 
        'bg-gradient-to-br from-pink-500 to-pink-400 text-white'
      }`}>
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className={`group relative max-w-[80%] rounded-2xl px-6 py-3 shadow-lg transition-all duration-300 hover:shadow-xl ${
        isBot ? 
        'bg-gradient-to-r from-pink-50/90 to-white/90 dark:from-pink-900/90 dark:to-gray-900/90' : 
        'bg-gradient-to-r from-white/90 to-pink-50/90 dark:from-gray-900/90 dark:to-pink-900/90'
      }`}>
        <p className={`${theme.text} text-lg`}>{message.content}</p>
        <div className="flex items-center justify-between gap-4 mt-2">
          <p className={`text-xs ${theme.secondaryText}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
          {onPlay && (
            <button
              onClick={() => onPlay(message.content)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
            >
              <Volume2 size={16} className={`${theme.secondaryText} hover:text-pink-500 dark:hover:text-pink-400`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}