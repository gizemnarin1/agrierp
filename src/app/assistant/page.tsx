'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isError?: boolean;
}



export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Merhaba! Ben AgriERP Akıllı Asistanıyım. 🍅\n\nBana tarlada yaptığınız işlemleri serbest metin olarak yazabilirsiniz. Örneğin:\n*\"Bugün 1 Nolu seradan 500 kilo domates topladık kilosu 20 liradan sattık. Ayrıca işçilere 1500 lira yevmiye verdim.\"*\n\nYazdıklarınızı anında analiz edip veritabanına işleyeceğim.",
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
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessageId = Math.random().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'İşlem sırasında bir sorun oluştu.');
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.message,
        timestamp: new Date()
      }]);

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'bot',
        text: `❌ Hata: ${error.message || 'Sunucuyla bağlantı kurulamadı.'}`,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] relative">
      {/* Üst Asistan Başlığı */}
      <div className="flex items-center gap-3 pb-3 border-b border-emerald-800/30">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shadow-lg animate-pulse-soft">
          <div className="w-full h-full rounded-2xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h1 className="text-sm font-bold text-emerald-100 flex items-center gap-1.5">
            AI Asistanı
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </h1>
          <p className="text-[10px] text-emerald-100/50">Çevrimiçi | Sesli ve yazılı NLP motoru</p>
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-slide-in`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-md border ${
                  isBot
                    ? msg.isError
                      ? 'bg-rose-950/40 border-rose-800/30 text-rose-200'
                      : 'bg-emerald-900/30 border-emerald-800/30 text-emerald-100'
                    : 'bg-emerald-600 border-emerald-500 text-white'
                }`}
              >
                {msg.text}
                <span className={`block text-[9px] text-right mt-1.5 ${isBot ? 'text-emerald-100/30' : 'text-emerald-100/70'}`}>
                  {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Yazıyor Efekti */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-emerald-900/30 border border-emerald-800/30 rounded-2xl px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>



      {/* Mesaj Gönderme Alanı */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="pt-2 border-t border-emerald-800/20 bg-background flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="İşleminizi buraya yazın..."
          className="flex-1 bg-emerald-950/40 border border-emerald-800/30 rounded-xl px-4 py-3 text-xs text-emerald-100 placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-lg active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
