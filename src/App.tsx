import React, { useState, useRef, useEffect } from 'react';
import { Brain, Bot, Sun, Moon, Heart, Sparkles } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, ChatState } from './types';
import { lightTheme, darkTheme } from './theme';
import EmotionalSupportChat from './components/EmotionalSupportChat';
import Modal from './components/Modal';

const INITIAL_MESSAGE: Message = {
  id: '1',
  content: "Hi! I'm MindMate, your mental health companion. How are you feeling today?",
  sender: 'bot',
  timestamp: new Date(),
};

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [INITIAL_MESSAGE],
    isTyping: false,
    isDarkMode: false,
    isListening: false,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = chatState.isDarkMode ? darkTheme : lightTheme;

  // Speech synthesis setup
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const responses = [
      "I understand how you're feeling. Would you like to talk more about that?",
      "That sounds challenging. How can I help you process these emotions?",
      "I'm here to listen and support you. What would be most helpful right now?",
      "Your feelings are valid. Would you like to explore some coping strategies together?",
      "Thank you for sharing that with me. How long have you been feeling this way?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    const response = await generateResponse(content);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'bot',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
      isTyping: false,
    }));
  };

  const toggleTheme = () => {
    setChatState(prev => ({
      ...prev,
      isDarkMode: !prev.isDarkMode,
    }));
    document.documentElement.classList.toggle('dark');
  };

  const playMessage = (content: string) => {
    if (synth.speaking) {
      synth.cancel();
    }
    utterance.text = content;
    synth.speak(utterance);
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (chatState.isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }

    setChatState(prev => ({
      ...prev,
      isListening: !prev.isListening,
    }));
  };

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          handleSendMessage(transcript);
          setChatState(prev => ({ ...prev, isListening: false }));
          recognition.stop();
        }
      };
    }
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openModal = (modal: 'privacy' | 'terms' | 'about') => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className={`${
          isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'
        } backdrop-blur-sm shadow-sm sticky top-0 z-10`}>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-indigo-600 to-pink-600' 
                  : 'bg-gradient-to-br from-indigo-500 to-pink-500'
              } flex items-center justify-center`}>
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600'
                }`}>
                  MindMate AI
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your Emotional Support Companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Heart className={`w-4 h-4 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                <span>Powered by Gemini</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors duration-300`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4">
          <EmotionalSupportChat isDarkMode={isDarkMode} />
        </main>

        {/* Footer */}
        <footer className={`${
          isDarkMode ? 'bg-gray-800/80 text-gray-400' : 'bg-white/80 text-gray-600'
        } backdrop-blur-sm p-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              <span>Always here to listen and support you</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => openModal('privacy')}
                className={`hover:${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
              >
                Privacy
              </button>
              <button
                onClick={() => openModal('terms')}
                className={`hover:${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
              >
                Terms
              </button>
              <button
                onClick={() => openModal('about')}
                className={`hover:${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
              >
                About
              </button>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <Modal
          isOpen={activeModal === 'privacy'}
          onClose={closeModal}
          title="Privacy Policy"
          isDarkMode={isDarkMode}
        >
          <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
            <h3>Your Privacy Matters to Us</h3>
            <p>At MindMate AI, we take your privacy seriously. Here's how we handle your data:</p>
            <ul>
              <li>All conversations are encrypted and secure</li>
              <li>We don't store personal information</li>
              <li>Your messages are processed in real-time</li>
              <li>No data is shared with third parties</li>
            </ul>
            <p>For more information, please contact us at privacy@mindmate.ai</p>
          </div>
        </Modal>

        <Modal
          isOpen={activeModal === 'terms'}
          onClose={closeModal}
          title="Terms of Service"
          isDarkMode={isDarkMode}
        >
          <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
            <h3>Terms and Conditions</h3>
            <p>By using MindMate AI, you agree to:</p>
            <ul>
              <li>Use the service for personal support only</li>
              <li>Not share harmful or inappropriate content</li>
              <li>Understand that this is not a replacement for professional help</li>
              <li>Respect the AI's responses and limitations</li>
            </ul>
            <p>We reserve the right to update these terms at any time.</p>
          </div>
        </Modal>

        <Modal
          isOpen={activeModal === 'about'}
          onClose={closeModal}
          title="About MindMate AI"
          isDarkMode={isDarkMode}
        >
          <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
            <h3>Your AI Emotional Support Companion</h3>
            <p>MindMate AI is designed to provide emotional support and guidance through:</p>
            <ul>
              <li>Empathetic conversations</li>
              <li>Active listening</li>
              <li>Positive reinforcement</li>
              <li>Helpful suggestions</li>
            </ul>
            <p>Powered by Google's Gemini AI, we aim to make mental health support more accessible.</p>
            <p className="text-sm mt-4">Version 1.0.0</p>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;