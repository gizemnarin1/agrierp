'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, Bot, User, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isError?: boolean;
}



export default function Assistant() {
  const supabase = createClient();
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
      <div className="flex items-center gap-3 pb-3 border-b border-zinc-200">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-green to-lime-500 p-[1.5px] shadow-sm animate-pulse-soft">
          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-primary-green">
            <Bot className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h1 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
            AI Asistanı
            <span className="w-2 h-2 rounded-full bg-primary-green animate-ping"></span>
          </h1>
          <p className="text-[10px] text-zinc-500">Çevrimiçi | Sesli ve yazılı NLP motoru</p>
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
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                  isBot
                    ? msg.isError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-white border-zinc-200 text-zinc-700'
                    : 'bg-primary-green border-primary-green text-white'
                }`}
              >
                {msg.text}
                <span className={`block text-[9px] text-right mt-1.5 ${isBot ? 'text-zinc-400' : 'text-emerald-100'}`}>
                  {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Yazıyor Efekti */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
        className="pt-2 border-t border-zinc-200 bg-background flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="İşleminizi buraya yazın..."
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green/30 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-primary-green hover:bg-primary-green/90 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-primary-green transition-colors shadow-md active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
