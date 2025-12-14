import React, { useState } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Gradix AI. Ask me anything about your uploaded subjects or general questions.", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const aiMsg = { id: Date.now() + 1, text: data.response, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = { id: Date.now() + 1, text: "Sorry, I couldn't reach the backend. Is it running?", sender: 'ai' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ id: 1, text: "Chat cleared. How can I help?", sender: 'ai' }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bot className="text-primary" /> Gradix Chat
          </h1>
          <p className="text-base-content/70 text-sm">Ask questions based on your knowledge base</p>
        </div>
        <button className="btn btn-ghost btn-circle text-error" onClick={clearChat} title="Clear Chat">
          <Trash2 size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-base-200 rounded-box p-4 overflow-y-auto mb-4 border border-base-300 shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-base-300 p-2 text-base-content">
                {msg.sender === 'user' ? <User size={24} /> : <Bot size={24} />}
              </div>
            </div>
            <div className={`chat-header opacity-50 text-xs mb-1`}>
              {msg.sender === 'user' ? 'You' : 'Gradix AI'}
            </div>
            <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 items-center bg-base-100 p-2 rounded-xl border border-base-300 shadow-sm">
        <input 
          type="text" 
          className="input input-ghost w-full focus:outline-none focus:bg-transparent px-4"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          className="btn btn-primary btn-circle"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
