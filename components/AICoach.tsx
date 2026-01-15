
import React, { useState, useRef, useEffect } from 'react';
import { Workout } from '../types';
import { getAIFitnessAdvice } from '../services/geminiService';
import { Bot, Send, User, Loader2, Sparkles } from 'lucide-react';

interface AICoachProps {
  workouts: Workout[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AICoach: React.FC<AICoachProps> = ({ workouts }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是你的智能健身教练。我可以根据你的运动记录提供建议，或者回答任何关于健身的问题。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const advice = await getAIFitnessAdvice(workouts, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: advice || '抱歉，我现在无法回答。' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: '发生了一点错误，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Bot className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">AI 智能私教</h2>
          <p className="text-sm text-slate-500">基于 Gemini AI 的个性化分析</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-inner"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-500 text-white rounded-tr-none' 
                  : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Loader2 className="animate-spin" size={16} />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 text-sm animate-pulse">
                思考中...
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          placeholder="问问教练该如何制定明天的训练计划..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-lg shadow-slate-100 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-3 top-3 p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send size={20} />
        </button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        <SuggestionChip text="分析我的本周表现" onClick={() => setInput('分析一下我本周的运动记录，我做得好吗？')} />
        <SuggestionChip text="减脂建议" onClick={() => setInput('我想在这周减掉1斤，根据我的记录该怎么练？')} />
        <SuggestionChip text="制定计划" onClick={() => setInput('帮我制定一个适合明天的30分钟室内力量训练计划。')} />
      </div>
    </div>
  );
};

const SuggestionChip: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
  >
    <Sparkles size={12} className="text-emerald-400" />
    {text}
  </button>
);
