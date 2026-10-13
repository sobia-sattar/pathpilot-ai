import React from 'react';
import {
  Sparkles,
  Users,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  Compass,
  Star,
  Coffee,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface AboutUsProps {
  onNavigateToTracks: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onNavigateToTracks }) => {
  const teamMembers = [
    {
      name: 'Sobia Sattar',
      role: 'Co-Founder & AI Systems Lead',
      tag: 'AI Architect & Vision',
      cardClass: 'card-pastel-yellow',
      avatarBg: 'bg-[#FFD233]',
      emoji: '👩‍💻',
      superpower: 'Strategic Vision & AI Empathy',
      shortIntro:
        'A passionate technologist who believes artificial intelligence should illuminate people’s paths rather than intimidate them. Sobia envisioned PathPilot as an empathetic companion that takes the overwhelming fog out of tech careers, giving every student the clarity, confidence, and exact steps to achieve their dream role.',
      drivingPassion:
        'Democratizing career intelligence so any curious learner can bridge the gap from classroom theory to high-impact engineering.',
      interests: ['AI Systems Design', 'Explainable ML', 'Student Empowerment', 'System Security'],
      quote: 'Technology reaches its highest purpose when it inspires human confidence and unlocks potential.'
    },
    {
      name: 'Muhammad Hassan',
      role: 'Co-Founder & Data Intelligence Lead',
      tag: 'Data Systems & Logic',
      cardClass: 'card-pastel-lavender',
      avatarBg: 'bg-[#C4B5FD]',
      emoji: '👨‍💻',
      superpower: 'Deep Systems Logic & Analytical Clarity',
      shortIntro:
        'An analytical thinker and relentless builder who finds harmony in complex data flows. Hassan is driven by the conviction that learning roadmaps must be grounded in transparent truth—building the resilient intelligence engines that power PathPilot’s skill matching and progress diagnostics with zero guesswork.',
      drivingPassion:
        'Creating high-trust, deterministic software where learners can see the direct mathematical reasoning behind every recommendation.',
      interests: ['High-Throughput Engines', 'Data Engineering', 'Semantic Intelligence', 'Clean Code'],
      quote: 'Great software eliminates doubt. When learners have honest feedback, their growth becomes unstoppable.'
    },
    {
      name: 'Sumra Shar',
      role: 'Co-Founder & Creative Product Lead',
      tag: 'Design & Interaction',
      cardClass: 'card-pastel-sky',
      avatarBg: 'bg-[#7DD3FC]',
      emoji: '👩‍🎨',
      superpower: 'Creative Intuition & Delightful UX',
      shortIntro:
        'A creative technologist who sees software as a canvas for human emotion and joy. Sumra believes learning tools should never feel cold or sterile. She shaped PathPilot’s welcoming Ronas IT design language, crafted Pip the cute mascot buddy, and engineered the fluid animations that make studying feel like a playful adventure.',
      drivingPassion:
        'Transforming daunting career milestones into friendly, joyful moments that keep students motivated day after day.',
      interests: ['Interaction Design', 'Micro-Animations', 'Cognitive Ergonomics', 'Creative Frontend'],
      quote: 'When an interface makes you smile, learning stops being a burden and becomes a daily delight.'
    }
  ];

  const coreValues = [
    {
      icon: Lightbulb,
      title: 'Radical Transparency',
      desc: 'No black-box scores or vague advice. Every percentage, skill gap, and milestone is mathematically explainable with clear evidence.'
    },
    {
      icon: Heart,
      title: 'Encouraging & Human',
      desc: 'Built with genuine empathy for students. From Pip’s cheerful guidance to bite-sized milestones, we replace career anxiety with optimism.'
    },
    {
      icon: Rocket,
      title: 'Actionable & Verifiable',
      desc: 'Real portfolio deliverables, verified lectures, and interactive code testing that hiring managers can see, evaluate, and trust.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-4 space-y-12 animate-fadeIn text-[#18191E]">
      {/* 1. Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEE883] text-[#18191E] text-xs font-black shadow-2xs hover:scale-105 transition-transform cursor-default">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5B37]" />
          <span>Meet the Founders • Team PathPilot</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#18191E] leading-tight">
          Crafted with heart for{' '}
          <span className="text-[#FF5B37] relative inline-block">
            human potential
            <span className="absolute bottom-1 left-0 w-full h-2 bg-[#FEE883] -z-10 rounded-full opacity-60"></span>
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          We are three university innovators—Sobia, Hassan, and Sumra—who came together with one shared dream: to make navigating tech careers honest, accessible, and delightful for everyone.
        </p>
      </div>

      {/* 2. Short Story Banner (The Trio's Mission) */}
      <div className="bg-gradient-to-r from-amber-50 via-purple-50 to-sky-50 border border-slate-200/80 p-6 sm:p-8 rounded-[32px] shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-[#18191E] text-white flex items-center justify-center text-3xl shadow-md shrink-0">
          <span>🤝</span>
        </div>
        <div className="space-y-1 text-center md:text-left flex-1">
          <h2 className="text-lg font-black text-[#18191E]">The Story Behind PathPilot</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            As students ourselves, we were exhausted by confusing job descriptions that demand 5 years of experience for entry-level roles, disconnected online courses, and generic tips. We asked: <em>What if career intelligence felt like a trusted mentor walking beside you?</em> Sobia’s AI strategy, Hassan’s data logic, and Sumra’s design intuition merged into PathPilot—your transparent companion from Day 1 to your first offer letter.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-3">
            <span className="w-10 h-10 rounded-full bg-[#FEE883] border-2 border-white flex items-center justify-center text-lg shadow-xs">👩‍💻</span>
            <span className="w-10 h-10 rounded-full bg-[#E0D4FD] border-2 border-white flex items-center justify-center text-lg shadow-xs">👨‍💻</span>
            <span className="w-10 h-10 rounded-full bg-[#BAE6FD] border-2 border-white flex items-center justify-center text-lg shadow-xs">👩‍🎨</span>
          </div>
        </div>
      </div>

      {/* 3. Team Member Cards: 3 Signature Pastel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className={`${member.cardClass} p-6 sm:p-7 rounded-[32px] flex flex-col justify-between space-y-6 shadow-sm border border-black/5 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group`}
          >
            <div className="space-y-4">
              {/* Avatar and Role Pill */}
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl ${member.avatarBg} border-2 border-white shadow-md flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  <span>{member.emoji}</span>
                </div>
                <span className="bg-[#18191E] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs">
                  {member.tag}
                </span>
              </div>

              {/* Name & Title */}
              <div>
                <h3 className="text-xl font-black text-[#18191E] tracking-tight">
                  {member.name}
                </h3>
                <div className="text-xs font-black text-slate-700/80 mt-0.5">
                  {member.role}
                </div>
              </div>

              {/* Quote / Personal Mantra */}
              <p className="text-xs text-slate-800/90 italic leading-relaxed bg-white/60 p-3 rounded-2xl border border-white/80 shadow-2xs">
                "{member.quote}"
              </p>

              {/* Short Bio / Intro */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-black text-[#18191E] uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#FF5B37]" />
                  <span>About {member.name.split(' ')[0]}:</span>
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {member.shortIntro}
                </p>
              </div>

              {/* Superpower Callout */}
              <div className="p-3 rounded-2xl bg-white/70 border border-white/80 space-y-1 shadow-2xs">
                <div className="text-[10px] font-black text-[#18191E] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Personal Superpower</span>
                </div>
                <div className="text-xs font-extrabold text-[#18191E]">
                  {member.superpower}
                </div>
              </div>

              {/* Core Passions Tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-black text-[#18191E] uppercase tracking-wider block">
                  Passionate About:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white text-[#18191E] shadow-2xs border border-black/5"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Core Values & Principles */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <h2 className="text-xl font-black text-[#18191E]">What We Believe In</h2>
          <p className="text-xs text-slate-500">The three foundational commitments that guide every feature we build.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coreValues.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FEE883] text-[#18191E] flex items-center justify-center shadow-2xs">
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-extrabold text-[#18191E]">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tech Stack Highlights */}
        <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-extrabold text-[#18191E]">Crafted With:</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700">Python 3.14</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700">FastAPI</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700">React & Vite</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700">TypeScript</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700">TailwindCSS</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Student-First Privacy</span>
          </div>
        </div>
      </div>

      {/* 5. Cute Mascot Banner with Action Button */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-[#FEE883] border border-[#FFD233] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-3xl bg-white border-2 border-[#18191E] flex items-center justify-center text-3xl shadow-sm shrink-0 animate-bounce-subtle">
            <span>🦊🐾</span>
          </div>
          <div>
            <h3 className="text-base font-black text-[#18191E]">Questions? Pip is Here to Guide You!</h3>
            <p className="text-xs text-slate-800 leading-snug mt-0.5">
              Sobia, Hassan, and Sumra created Pip so you always have a friendly tutor ready to chat in <strong>English</strong>, <strong>اردو</strong>, or <strong>Roman Urdu</strong>!
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToTracks}
          className="px-6 py-3 rounded-full bg-[#18191E] hover:bg-black text-white text-xs font-black shadow-md shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <span>Explore Career Tracks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
