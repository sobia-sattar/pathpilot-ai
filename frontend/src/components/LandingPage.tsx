import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Target,
  FileCheck2,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  UserPlus,
  Zap,
  Code2,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
  BrainCircuit,
  Workflow,
  Briefcase,
  Bookmark,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tabId: string) => void;
  onLoadDemo: () => void;
  onOpenLogin: (isRegister?: boolean) => void;
  currentUser?: any;
  readinessScore?: number;
  targetRole?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onLoadDemo,
  onOpenLogin,
  currentUser,
  readinessScore = 42,
  targetRole = 'Junior AI/ML Engineer',
}) => {
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);

  const curatedRoles = [
    {
      id: 'job_aiml_junior',
      title: 'Junior AI/ML Engineer',
      domain: 'Artificial Intelligence',
      pill: 'Machine Learning',
      cardClass: 'card-pastel-yellow',
      skillsCount: '5/20 skills',
      readiness: 42,
      timeframe: '10 - 12 Weeks',
      demonstrated: ['Python', 'SQL', 'Basic Statistics', 'Git & GitHub'],
      inProgress: ['Machine Learning (L1 → L3)', 'Data Visualization'],
      missing: ['Model Evaluation & Metrics', 'PyTorch Framework', 'Feature Engineering'],
      topProject: 'Production Sentiment Classifier API',
      peers: '+120 candidates',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'job_data_analyst',
      title: 'Data Analyst & BI Specialist',
      domain: 'Analytics & BI',
      pill: 'Data Science',
      cardClass: 'card-pastel-lavender',
      skillsCount: '12/50 skills',
      readiness: 68,
      timeframe: '6 - 8 Weeks',
      demonstrated: ['Python', 'SQL Queries', 'Pandas', 'Descriptive Stats'],
      inProgress: ['Exploratory Data Analysis', 'Interactive Dashboards'],
      missing: ['A/B Testing Frameworks', 'Business KPI Modeling', 'PowerBI / Tableau'],
      topProject: 'Interactive Customer Churn Dashboard',
      peers: '+80 candidates',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'job_fullstack_dev',
      title: 'Full-Stack Web Engineer',
      domain: 'Web Engineering',
      pill: 'Software Dev',
      cardClass: 'card-pastel-sky',
      skillsCount: '18/22 skills',
      readiness: 52,
      timeframe: '8 - 10 Weeks',
      demonstrated: ['Python', 'Git', 'REST APIs', 'FastAPI'],
      inProgress: ['Modern JavaScript (ES6+)', 'React Components'],
      missing: ['State Management (Redux/Zustand)', 'PostgreSQL Relational Design', 'CI/CD Pipelines'],
      topProject: 'Full-Stack Collaborative Task Manager',
      peers: '+24 candidates',
      avatars: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80'
      ]
    }
  ];

  const activeRole = curatedRoles[selectedRoleIdx];

  return (
    <div className="space-y-12 animate-fadeIn text-[#18191E]">
      {/* ========================================================= */}
      {/* 1. SOPHISTICATED HERO HEADER (LEARNIFY AESTHETIC)         */}
      {/* ========================================================= */}
      <section className="text-center pt-4 pb-2 space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FEE883] text-[#18191E] text-xs font-extrabold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Precision Career & Skill Navigator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#18191E] leading-tight">
          Your current skills. Your dream job.{' '}
          <span className="text-[#FF5B37] block sm:inline">The clear path forward.</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
          Understand the exact gap between your candidate resume and target industry benchmarks.
          Get verified skill scores and a personalized 4-phase milestone roadmap.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!currentUser ? (
            <>
              <button
                onClick={() => onOpenLogin(true)}
                className="btn-coral px-6 py-2.5 rounded-full text-xs font-extrabold shadow-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </button>

              <button
                onClick={() => onOpenLogin(false)}
                className="px-5 py-2.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#18191E] font-extrabold text-xs transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={onLoadDemo}
                className="px-5 py-2.5 rounded-full bg-[#FEE883] hover:bg-[#FFD233] text-[#18191E] font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Sample Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-coral px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Open Tracks Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('analyze')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18191E] font-semibold text-xs transition-colors"
              >
                Analyze New Resume
              </button>
            </>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THE 3 SIGNATURE PASTEL TRACK CARDS (RONAS IT STYLE)    */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-xl font-extrabold text-[#18191E]">Featured career tracks</h2>
          <span className="text-xs font-semibold text-slate-400">Select to inspect gaps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {curatedRoles.map((role, idx) => {
            const isSelected = selectedRoleIdx === idx;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleIdx(idx)}
                className={`${role.cardClass} p-5 flex flex-col justify-between space-y-4 shadow-xs cursor-pointer border-2 transition-all ${
                  isSelected ? 'border-[#18191E] shadow-md scale-[1.01]' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#18191E] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {role.pill}
                  </span>
                  <Bookmark className="w-4 h-4 text-[#18191E] fill-current" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#18191E] leading-snug">
                    {role.title}
                  </h3>
                  <div className="text-[11px] text-[#18191E]/70 font-semibold mt-0.5">
                    Est. Duration: {role.timeframe}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#18191E]">
                    <span>Readiness Match</span>
                    <span>{role.readiness}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/15 overflow-hidden">
                    <div
                      className="h-full bg-[#18191E] rounded-full"
                      style={{ width: `${role.readiness}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Row: Avatars & Coral Button */}
                <div className="flex items-center justify-between pt-2 border-t border-black/10">
                  <div className="flex items-center -space-x-2">
                    {role.avatars.map((av, i) => (
                      <img
                        key={i}
                        src={av}
                        alt="Candidate"
                        className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs"
                      />
                    ))}
                    <span className="w-7 h-7 rounded-full bg-[#18191E] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                      +120
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentUser) {
                        onNavigate('dashboard');
                      } else {
                        onOpenLogin(false);
                      }
                    }}
                    className="btn-coral px-4 py-2 text-xs font-bold shadow-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE SIMULATION OF ACTIVE ROLE GAPS             */}
      {/* ========================================================= */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5B37]">
              Active Blueprint Simulation
            </span>
            <h3 className="text-2xl font-black text-[#18191E]">{activeRole.title}</h3>
          </div>

          <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-2xl border border-[#E2E8F0]">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Benchmark Match</div>
              <div className="text-lg font-black text-[#18191E]">{activeRole.readiness}% Match</div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FEE883] text-[#18191E]">
              {activeRole.timeframe}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Demonstrated */}
          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
            <div className="text-xs font-bold text-[#166534] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
              <span>Verified Competencies</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeRole.demonstrated.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#86EFAC] text-[#166534] font-semibold">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#15803d] pt-1">Directly extracted from candidate profile.</p>
          </div>

          {/* Needs Practice */}
          <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
            <div className="text-xs font-bold text-[#92400E] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#D97706]" />
              <span>Needs Practice</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeRole.inProgress.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#FCD34D] text-[#92400E] font-semibold">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#B45309] pt-1">Basic knowledge found, role requires working proficiency.</p>
          </div>

          {/* Critical Missing */}
          <div className="p-4 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] space-y-2">
            <div className="text-xs font-bold text-[#9F1239] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#E11D48]" />
              <span>Missing Must-Haves</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeRole.missing.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#FDA4AF] text-[#9F1239] font-semibold">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#BE123C] pt-1">High-priority core requirements mapped to roadmap.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-[#F1F5F9]">
          <div>
            Recommended milestone project: <strong className="text-[#18191E]">{activeRole.topProject}</strong>
          </div>
          <button
            onClick={() => {
              if (currentUser) {
                onNavigate('dashboard');
              } else {
                onOpenLogin(false);
              }
            }}
            className="font-bold text-[#FF5B37] hover:text-[#EE4B27] flex items-center gap-1 transition-colors"
          >
            <span>{currentUser ? 'Inspect Full Dashboard' : 'Sign In to View Full Plan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. THREE STEP PROCESS (RONAS IT STYLE CARDS)              */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-xl font-extrabold text-[#18191E]">How PathPilot AI works</h2>
          <p className="text-xs text-slate-500">Transparent 3-engine pipeline with zero fabricated qualifications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-xl bg-[#FEE883] text-[#18191E] font-black text-xs flex items-center justify-center">
              01
            </span>
            <h3 className="text-base font-bold text-[#18191E]">Upload Resume</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              PyMuPDF and fallback text parser extract skills, education, and contextual evidence sentences with complete user review control.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-xl bg-[#E0D4FD] text-[#18191E] font-black text-xs flex items-center justify-center">
              02
            </span>
            <h3 className="text-base font-bold text-[#18191E]">Calculate Skill Gaps</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compares skills against canonical job taxonomies using exact, alias, and TF-IDF semantic similarities with explainable weighted scores.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] space-y-3 shadow-xs">
            <span className="w-8 h-8 rounded-xl bg-[#BAE6FD] text-[#18191E] font-black text-xs flex items-center justify-center">
              03
            </span>
            <h3 className="text-base font-bold text-[#18191E]">Follow Roadmap</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sequenced 4-phase learning milestones mapped to verified documentation and practical portfolio project deliverables.
            </p>
          </div>
        </div>

        {/* Meet the Team Banner */}
        <div className="bg-[#18191E] text-white p-6 sm:p-7 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE883] text-[#18191E] text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Team PathPilot</span>
            </div>
            <h3 className="text-lg font-bold text-white">Created by Sobia Sattar, Muhammad Hassan & Sumera Shar</h3>
            <p className="text-xs text-slate-400">Discover our AI architecture, data engineering systems, and human-centered design approach.</p>
          </div>
          <button
            onClick={() => onNavigate('about')}
            className="px-6 py-3 rounded-full bg-white text-[#18191E] font-extrabold text-xs hover:bg-[#FEE883] transition-colors shrink-0 flex items-center gap-2 shadow-sm"
          >
            <span>Meet Our Team</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
