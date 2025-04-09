import React, { useState, useRef, useEffect } from 'react';
import { getEmotionalSupport } from '../services/geminiService';
import { Send, Mic, Pause, Loader2, Brain } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface EmotionalSupportChatProps {
  isDarkMode: boolean;
}

const EmotionalSupportChat: React.FC<EmotionalSupportChatProps> = ({ isDarkMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessage: Message = {
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getEmotionalSupport(userMessage);
      const aiMessage: Message = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "<p>I'm sorry, I'm having trouble processing your request right now.</p>", 
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add voice recording functionality here
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Chat Messages */}
      <div className={`flex-1 overflow-y-auto rounded-xl ${
        isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
      } backdrop-blur-sm p-4 space-y-4 mb-4 shadow-sm scrollbar-hide`}>
        {messages.length === 0 ? (
          <div className={`h-full flex flex-col items-center justify-center text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className={`w-16 h-16 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-br from-indigo-600 to-pink-600' 
                : 'bg-gradient-to-br from-indigo-100 to-pink-100'
            } flex items-center justify-center mb-4`}>
              <Brain className={isDarkMode ? 'text-white' : 'text-indigo-500'} size={32} />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Welcome to MindMate AI ✨</h3>
            <p className="max-w-md">I'm here to listen and support you. Feel free to share what's on your mind! 💭</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-pink-500 text-white'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-100' 
                      : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.isUser ? (
                  <div className="text-sm">{message.text}</div>
                ) : (
                  <div 
                    className={`prose prose-sm max-w-none ${
                      isDarkMode ? 'prose-invert' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                )}
                <div className={`text-xs mt-1 ${
                  message.isUser 
                    ? 'text-white/70' 
                    : isDarkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl p-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Loader2 className={`w-5 h-5 ${
                isDarkMode ? 'text-indigo-400' : 'text-indigo-500'
              } animate-spin`} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`${
        isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
      } backdrop-blur-sm rounded-xl p-4 shadow-sm`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
              className={`w-full p-3 pr-12 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-400' 
                  : 'border-gray-200 focus:ring-indigo-500'
              } focus:outline-none focus:ring-2 focus:border-transparent`}
            />
            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-full ${
                isRecording 
                  ? 'text-red-500' 
                  : isDarkMode 
                    ? 'text-gray-400 hover:bg-gray-700' 
                    : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {isRecording ? <Pause size={20} /> : <Mic size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-xl bg-gradient-to-br ${
              isDarkMode 
                ? 'from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700' 
                : 'from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600'
            } text-white disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform hover:scale-105`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmotionalSupportChat; 