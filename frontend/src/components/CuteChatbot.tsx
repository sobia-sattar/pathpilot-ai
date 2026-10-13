import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Globe,
  Smile,
  ChevronDown,
  RotateCcw,
  Compass,
  ArrowRight,
  Heart,
  Volume2
} from 'lucide-react';
import { api } from '../services/api';

interface Message {
  id: string;
  sender: 'user' | 'pip';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isRtl?: boolean;
}

interface CuteChatbotProps {
  currentUser?: any;
  targetRole?: string;
  readinessScore?: number;
  missingSkills?: string[];
  activeMilestone?: string;
}

export const CuteChatbot: React.FC<CuteChatbotProps> = ({
  currentUser,
  targetRole = 'Junior AI/ML Engineer',
  readinessScore = 42,
  missingSkills = ['Machine Learning', 'PyTorch', 'Model Evaluation'],
  activeMilestone = 'Establish Foundations in Python',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'english' | 'urdu' | 'roman'>('english');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'pip',
      text: `Hello ${currentUser?.name ? currentUser.name.split(' ')[0] : 'friend'}! I'm **Pip**, your cute AI Career Buddy! 🦊🐾✨\n\nI can help you navigate **${targetRole}**, explain complex topics, or give interview tips in **English**, **اردو (Urdu)**, or **Roman Urdu**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How do I close my skill gaps?',
        'Readiness score kaise barhayen?',
        'اردو میں کیریئر گائیڈنس',
        'Top interview questions'
      ]
    }
  ]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const isRtlText = (text: string): boolean => {
    return /[\u0600-\u06FF]/.test(text);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessageId = `user_${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRtl: isRtlText(text)
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await api.sendChatMessage(text, {
        target_role: targetRole,
        readiness_score: readinessScore,
        missing_skills: missingSkills,
        active_milestone: activeMilestone,
      });

      const pipReplyText = response.reply || "I'm right here with you! Let's keep learning! 🚀";
      const pipMsg: Message = {
        id: `pip_${Date.now()}`,
        sender: 'pip',
        text: pipReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions || [],
        isRtl: isRtlText(pipReplyText)
      };

      setMessages((prev) => [...prev, pipMsg]);
    } catch (err) {
      // High-accuracy friendly local fallback
      const isUrdu = isRtlText(text);
      const isRoman = /kaise|kya|batao|mujhe|seekhein|hai|kisne|banaya|team/.test(text.toLowerCase());
      const lower = text.toLowerCase();

      let fallbackReply = `I'm here with you! For **${targetRole}**, focusing on your active milestone will boost your readiness score past ${readinessScore}%! 🦊✨`;
      
      // Creators inquiry fallback
      if (/who made|creators|founders|team|sobia|hassan|sumera|sumra/.test(lower)) {
        fallbackReply = `PathPilot was created with passion by **Sobia Sattar** (AI Systems Lead), **Muhammad Hassan** (Data Intelligence Lead), and **Sumera Shar** (Creative Product Lead)! Click **'Our Team'** in the navigation to read our story! 🌟👩‍💻👨‍💻👩‍🎨`;
      } else if (/kis ne|kisne|team|founders/.test(lower) && isRoman) {
        fallbackReply = `PathPilot ko **Sobia Sattar**, **Muhammad Hassan**, aur **Sumera Shar** ne banaya hai! Navigation mein **'Our Team'** par click karein aur hamari journey dekhein! 🐾🌟`;
      } else if (isUrdu) {
        fallbackReply = `میں آپ کی رہنمائی کے لیے حاضر ہوں! **${targetRole}** کے لیے روڈ میپ کے ویڈیو لیکچرز مکمل کریں تاکہ آپ کا اسکور بڑھ سکے! 🚀`;
      } else if (isRoman) {
        fallbackReply = `Main aap ke saath hoon! **${targetRole}** ke aglay milestone ko mukammal karein aur rozana thori coding practice zaroor karein! 💪✨`;
      }

      const fallbackMsg: Message = {
        id: `pip_${Date.now()}`,
        sender: 'pip',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Agla step kya hai?', 'What should I study next?', 'Motivation boost!'],
        isRtl: isUrdu
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Cute Mascot SVG Illustration (Pip with Headphones)
  const PipAvatar = ({ size = 'normal' }: { size?: 'normal' | 'large' | 'mini' }) => {
    const dim = size === 'large' ? 'w-14 h-14' : size === 'mini' ? 'w-7 h-7' : 'w-10 h-10';
    return (
      <div className={`relative ${dim} rounded-2xl bg-[#FEE883] border-2 border-[#FFD233] flex items-center justify-center shadow-md select-none shrink-0 group`}>
        {/* Cute Mascot Face SVG */}
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%]">
          {/* Ears */}
          <polygon points="20,35 32,8 45,30" fill="#FF5B37" />
          <polygon points="25,32 32,15 40,28" fill="#FEE883" />
          <polygon points="80,35 68,8 55,30" fill="#FF5B37" />
          <polygon points="75,32 68,15 60,28" fill="#FEE883" />
          {/* Head */}
          <ellipse cx="50" cy="55" rx="38" ry="32" fill="#FFA726" />
          <ellipse cx="50" cy="58" rx="28" ry="24" fill="#FFFFFF" />
          {/* Eyes (Cute big joyful eyes) */}
          <ellipse cx="38" cy="50" rx="4.5" ry="6.5" fill="#18191E" />
          <circle cx="36" cy="48" r="1.8" fill="#FFFFFF" />
          <ellipse cx="62" cy="50" rx="4.5" ry="6.5" fill="#18191E" />
          <circle cx="60" cy="48" r="1.8" fill="#FFFFFF" />
          {/* Rosy Blushing Cheeks */}
          <circle cx="30" cy="58" r="4.5" fill="#FF8A80" opacity="0.8" />
          <circle cx="70" cy="58" r="4.5" fill="#FF8A80" opacity="0.8" />
          {/* Cute Nose and Smile */}
          <ellipse cx="50" cy="57" rx="3" ry="2.2" fill="#18191E" />
          <path d="M46,62 Q50,67 54,62" stroke="#18191E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Student Headphones */}
          <path d="M22,50 Q20,20 50,20 Q80,20 78,50" stroke="#18191E" strokeWidth="4" fill="none" />
          <rect x="15" y="44" width="8" height="15" rx="4" fill="#FF5B37" stroke="#18191E" strokeWidth="2" />
          <rect x="77" y="44" width="8" height="15" rx="4" fill="#FF5B37" stroke="#18191E" strokeWidth="2" />
        </svg>
        {/* Glowing Status Dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border-2 border-white shadow-xs" />
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* CUTE FLOATING LAUNCHER BUTTON: Only Cute Pip Mascot & 'Chat with Pip' */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#18191E] hover:bg-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-white/20 cursor-pointer"
          title="Chat with Pip"
        >
          {/* Animated Mascot Head */}
          <PipAvatar size="normal" />

          <span className="text-xs sm:text-sm font-black text-white pr-1 sm:pr-2 tracking-tight">
            Chat with Pip
          </span>
        </button>
      )}

      {/* 3. EXPANDED CUTE CHAT WINDOW (Ronas IT / Learnify Aesthetic) */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-[410px] max-w-[420px] h-[520px] max-h-[82vh] bg-white border border-[#CBD5E1] rounded-[28px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-scaleIn text-[#18191E]">
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#18191E] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <PipAvatar size="normal" />

              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Pip</span>
                  <span className="text-[9px] px-2 py-0.2 rounded-full bg-[#FFD233] text-[#18191E] font-black uppercase tracking-wider">
                    Learning Coach
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                  <Globe className="w-3 h-3 text-[#FF5B37]" />
                  <span>English • اردو • Roman Urdu</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Minimize Chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-slate-600">
            <div className="truncate max-w-[240px]">
              Target: <strong className="text-[#18191E]">{targetRole}</strong>
            </div>
            <div className="flex items-center gap-1 shrink-0 font-extrabold text-[#FF5B37]">
              <span>{readinessScore}% Match</span>
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF5FF]/20 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col animate-fadeInUp ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[88%] ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar Icon */}
                  {msg.sender === 'pip' ? (
                    <PipAvatar size="mini" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#18191E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-2xs">
                      {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    dir={msg.isRtl ? 'rtl' : 'ltr'}
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#FF5B37] text-white rounded-tr-none shadow-xs font-medium'
                        : 'bg-white border border-[#E2E8F0] text-[#18191E] rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className={lIdx > 0 ? 'mt-1.5' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-9">
                  {msg.timestamp}
                </span>

                {/* Suggestions Pills underneath Pip's messages */}
                {msg.suggestions && msg.suggestions.length > 0 && msg.sender === 'pip' && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-9 max-w-[95%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FEE883] border border-[#CBD5E1] text-[#18191E] text-[10px] font-bold transition-all shadow-2xs hover:scale-102 cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <PipAvatar size="mini" />
                <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] flex items-center gap-1.5 shadow-2xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5B37] animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5B37] animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5B37] animate-bounce delay-200" />
                  <span className="text-[10px] font-bold text-slate-400 ml-1">Pip is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Bar */}
          <div className="px-3 py-1.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-slate-400 font-bold shrink-0">Quick:</span>
            <button
              onClick={() => handleSendMessage("Readiness score kaise barhayen?")}
              className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 whitespace-nowrap hover:border-[#18191E] cursor-pointer"
            >
              Score barhanay ka tareeqa
            </button>
            <button
              onClick={() => handleSendMessage("What should I study next on my roadmap?")}
              className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 whitespace-nowrap hover:border-[#18191E] cursor-pointer"
            >
              What should I study next?
            </button>
            <button
              onClick={() => handleSendMessage("انٹرویو کے اہم سوالات بتائیں")}
              className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 whitespace-nowrap hover:border-[#18191E] cursor-pointer font-bold"
            >
              انٹرویو گائیڈ
            </button>
          </div>

          {/* Input Box Bar */}
          <div className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              dir={isRtlText(inputText) ? 'rtl' : 'ltr'}
              placeholder="Ask in English or Urdu (یہاں سوال پوچھیں)..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-[#FF5B37]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full btn-coral disabled:opacity-40 flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
