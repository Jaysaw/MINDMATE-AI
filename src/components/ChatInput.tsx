import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  theme: any;
}

export function ChatInput({ onSendMessage, disabled, isListening, onToggleVoice, theme }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <button
        type="button"
        onClick={onToggleVoice}
        className={`rounded-full p-3 ${theme.primary} text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
      >
        {isListening ? <MicOff size={22} /> : <Mic size={22} />}
      </button>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        disabled={disabled}
        className={`flex-1 rounded-full px-6 py-3 ${theme.surface} border-2 border-transparent focus:border-purple-400 dark:focus:border-purple-500 focus:outline-none disabled:opacity-50 ${theme.text} text-lg shadow-lg`}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={`rounded-full p-3 ${theme.primary} text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
      >
        <Send size={22} />
      </button>
    </form>
  );
}