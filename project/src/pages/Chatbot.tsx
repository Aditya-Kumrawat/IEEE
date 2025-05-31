import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your mental health assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Prepare chat history for backend
    const chatHistory = [...messages, userMessage].map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    // Add a placeholder bot message
    const botId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      {
        id: botId,
        text: '',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);

    try {
      const response = await fetch('/api/ai-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, chatHistory }),
      });
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      let done = false;
      let botMessage = '';
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = new TextDecoder().decode(value);
          botMessage += chunk;
          setMessages(prev => {
            const updated = [...prev];
            // Update the last bot message
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              text: botMessage
            };
            return updated;
          });
        }
      }
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: 'Sorry, there was an error contacting the AI.'
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
      <div className="relative w-full max-w-3xl h-[80vh] bg-white dark:bg-neutral-800 rounded-3xl shadow-lg flex flex-col">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-base break-words ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-bl-md'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'bot' ? (
                    <Bot className="h-4 w-4 mr-2 text-primary-600" />
                  ) : (
                    <User className="h-4 w-4 mr-2 text-white" />
                  )}
                  <span className="text-sm font-medium">
                    {message.sender === 'bot' ? 'Assistant' : 'You'}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area fixed at the bottom */}
        <form
          className="w-full px-4 py-4 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-700"
          style={{ borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Medy and Keyy"
            className="flex-1 px-6 py-3 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-sm"
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="ml-2 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold shadow-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot; 