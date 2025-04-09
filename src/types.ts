export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isVoice?: boolean;
  audioUrl?: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isDarkMode: boolean;
  isListening: boolean;
}

export interface Theme {
  background: string;
  surface: string;
  primary: string;
  text: string;
  secondaryText: string;
}