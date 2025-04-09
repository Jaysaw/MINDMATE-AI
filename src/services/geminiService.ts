import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const getEmotionalSupport = async (message: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an empathetic AI assistant providing emotional support with a friendly personality. 
    Use emojis in your responses to make them more engaging and warm.
    Keep responses concise (5-6 lines) and use HTML tags for formatting:
    - Use <h3> for main points
    - Use <p> for paragraphs
    - Use <ul> and <li> for lists
    - Use <br> for line breaks
    - Use <strong> for emphasis
    - Use <em> for gentle emphasis
    - Use <table> for structured information
    - Use <ol> for numbered steps
    
    Here's the message: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    return "<p>I'm sorry, I'm having trouble processing your request right now. Please try again later. 😔</p>";
  }
}; 