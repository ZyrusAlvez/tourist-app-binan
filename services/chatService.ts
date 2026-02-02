import groq from '@/lib/groq';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatService {
  static async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for finding places in Binan, Laguna, Philippines. Help users discover cafes, restaurants, tourist attractions, parks, and museums. Keep responses concise and friendly.'
          },
          ...messages
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Chat service error:', error);
      return 'Sorry, there was an error processing your request. Please try again.';
    }
  }
}