import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

interface GeminiConfig {
  temperature?: number;
  maxOutputTokens?: number;
}

const isEmotionalSupportDomain = (message: string): boolean => {
  const nonEmotionalKeywords = [
    'buy', 'sell', 'purchase', 'price', 'cost', 'shopping', 'market',
    'business', 'investment', 'trading', 'stock', 'crypto', 'bitcoin',
    'advertisement', 'promotion', 'deal', 'offer', 'discount'
  ];
  
  const lowerMessage = message.toLowerCase();
  return !nonEmotionalKeywords.some(keyword => lowerMessage.includes(keyword));
};

export const getEmotionalSupport = async (
  message: string,
  config: GeminiConfig = {}
): Promise<string> => {
  try {
    // Validate if the message is within emotional support domain
    if (!isEmotionalSupportDomain(message)) {
      return "<p>I'm sorry, but I'm designed specifically to provide emotional support and mental well-being guidance. I can't assist with commercial, financial, or other non-emotional support matters. Please feel free to share your feelings, thoughts, or emotional concerns instead. 💙</p>";
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: config.temperature ?? 0.3, // Lower default temperature for more focused responses
        maxOutputTokens: config.maxOutputTokens ?? 500, // Lower default tokens for more concise responses
      }
    });
    
    const prompt = `You are an empathetic AI assistant providing emotional support with a friendly personality. 
    Your responses should be focused, supportive, and directly address emotional needs.
    Use emojis in your responses to make them more engaging and warm.
    Keep responses concise (3-4 lines) and use HTML tags for formatting:
    - Use <h3> for main points
    - Use <p> for paragraphs
    - Use <ul> and <li> for lists
    - Use <br> for line breaks
    - Use <strong> for emphasis
    - Use <em> for gentle emphasis
    
    Here's the message: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    return "<p>I'm sorry, I'm having trouble processing your request right now. Please try again later. 😔</p>";
  }
}; 