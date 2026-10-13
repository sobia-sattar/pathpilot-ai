import React, { useState } from 'react';
import {
  Target,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  X,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Zap,
  Star,
  Check
} from 'lucide-react';
import { SkillMatchResult, SkillGapAnalysisResponse } from '../types/api';

interface SkillGapAnalysisProps {
  analysis: SkillGapAnalysisResponse | null;
  onUpdateProficiency: (skillName: string, newLevel: number) => void;
  onNavigateToRoadmap: () => void;
  selectedSkillName?: string | null;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({
  analysis,
  onUpdateProficiency,
  onNavigateToRoadmap,
  selectedSkillName,
}) => {
  const [filter, setFilter] = useState<'all' | 'must_have' | 'needs_improvement' | 'missing' | 'demonstrated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalSkill, setActiveModalSkill] = useState<SkillMatchResult | null>(null);

  if (!analysis) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-[32px] p-8 border border-slate-200">
        <Target className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-black text-[#18191E]">No Analysis Available Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Upload a resume or explore careers to unlock your personalized skill growth map.
        </p>
      </div>
    );
  }

  // Filter skills
  const filteredSkills = analysis.skill_analysis.filter((skill) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        skill.skill.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (filter === 'must_have') return skill.priority === 'must-have' && skill.gap > 0;
    if (filter === 'needs_improvement') return skill.status === 'needs_improvement';
    if (filter === 'missing') return skill.status === 'missing';
    if (filter === 'demonstrated') return skill.status === 'demonstrated';
    return true;
  });

  const getLevelLabel = (lvl: number) => {
    switch (lvl) {
      case 0: return 'Not Started';
      case 1: return 'Beginner';
      case 2: return 'Hands-on';
      case 3: return 'Proficient';
      case 4: return 'Advanced';
      default: return `Level ${lvl}`;
    }
  };

  const getCleanTip = (skill: SkillMatchResult) => {
    if (skill.status === 'demonstrated') {
      return `Mastered! You meet the Level ${skill.required_level} standard for this role.`;
    }
    if (skill.current_level > 0) {
      return `You're at Level ${skill.current_level}. Practicing up to Level ${skill.required_level} will boost your overall readiness.`;
    }
    return `Recommended starting skill! Aim for Level ${skill.required_level} to unlock core milestones.`;
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#18191E]">
      {/* 1. Welcoming Human Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEE883] text-[#18191E] text-xs font-black shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5B37]" />
            <span>Personalized Skill Compass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#18191E] tracking-tight">
            My Skills & Growth Targets
          </h1>
          <p className="text-xs text-slate-500">
            A clear, encouraging breakdown of what you know and where to focus next for <strong>{analysis.target_job_title}</strong>.
          </p>
        </div>

        {/* 3 Cute Pastel Summary Badges */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <div className="px-2.5 sm:px-3.5 py-2 rounded-2xl bg-[#FEE883]/60 border border-[#FFD233] text-center">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Readiness</div>
            <div className="text-sm sm:text-base font-black text-[#18191E]">{analysis.readiness_score}%</div>
          </div>
          <div className="px-2.5 sm:px-3.5 py-2 rounded-2xl bg-[#E0D4FD]/60 border border-[#C4B5FD] text-center">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Mastered</div>
            <div className="text-sm sm:text-base font-black text-[#18191E]">{analysis.demonstrated_count}</div>
          </div>
          <div className="px-2.5 sm:px-3.5 py-2 rounded-2xl bg-[#BAE6FD]/60 border border-[#7DD3FC] text-center">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Next Up</div>
            <div className="text-sm sm:text-base font-black text-[#18191E]">{analysis.missing_count + analysis.needs_improvement_count}</div>
          </div>
        </div>
      </div>

      {/* 2. Cute Filter Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#18191E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200'
            }`}
          >
            All ({analysis.skill_analysis.length})
          </button>
          <button
            onClick={() => setFilter('must_have')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'must_have'
                ? 'bg-[#FF5B37] text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Core Essentials
          </button>
          <button
            onClick={() => setFilter('needs_improvement')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'needs_improvement'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            In Progress ({analysis.needs_improvement_count})
          </button>
          <button
            onClick={() => setFilter('demonstrated')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === 'demonstrated'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Mastered ({analysis.demonstrated_count})
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-[#FF5B37]"
          />
        </div>
      </div>

      {/* 3. Skill Cards Grid (Cute, Compact, Humanized Bento Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => {
          const isMastered = skill.status === 'demonstrated';
          const isNeedsImprovement = skill.status === 'needs_improvement';

          return (
            <div
              key={skill.skill}
              className={`p-5 rounded-[28px] border bg-white shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isMastered ? 'border-emerald-200/80 bg-emerald-50/10' : 'border-[#E2E8F0]'
              }`}
            >
              {/* Top Row: Category + Skill Name + Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {skill.category}
                    </span>
                    {skill.priority === 'must-have' && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FEE883] text-[#18191E]">
                        Core Essential
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full flex items-center gap-1 ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-800'
                        : isNeedsImprovement
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isMastered && <Check className="w-3 h-3 stroke-[3]" />}
                    {isNeedsImprovement && <Zap className="w-3 h-3 text-amber-600" />}
                    {!isMastered && !isNeedsImprovement && <Sparkles className="w-3 h-3 text-rose-600" />}
                    <span>{isMastered ? 'Mastered' : isNeedsImprovement ? 'In Progress' : 'Next to Learn'}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-[#18191E] tracking-tight">
                    {skill.skill}
                  </h3>
                </div>
              </div>

              {/* Unified Visual Proficiency Stepper (Cute Pills) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">
                    Current: <strong className="text-[#18191E]">{getLevelLabel(skill.current_level)}</strong>
                  </span>
                  <span className="font-extrabold text-[#FF5B37]">
                    Target: Level {skill.required_level}
                  </span>
                </div>

                {/* 4-Segment Visual Gauge */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((step) => {
                    const isFilled = step <= skill.current_level;
                    const isTarget = step === skill.required_level;
                    return (
                      <div
                        key={step}
                        className={`h-2 rounded-full transition-all duration-300 relative ${
                          isFilled
                            ? 'bg-[#18191E]'
                            : step <= skill.required_level
                            ? 'bg-amber-200/80'
                            : 'bg-slate-200'
                        }`}
                      >
                        {isTarget && !isMastered && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF5B37] absolute -top-1 right-1/2 translate-x-1/2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Friendly Human Growth Tip */}
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <Lightbulb className="w-3.5 h-3.5 text-[#FF5B37] shrink-0 mt-0.5" />
                <span>{getCleanTip(skill)}</span>
              </div>

              {/* Bottom Row: Quick 1-Click Level Setter & Details */}
              <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Update My Level:
                  </span>
                  <button
                    onClick={() => setActiveModalSkill(skill)}
                    className="text-[11px] font-bold text-[#FF5B37] hover:underline flex items-center gap-0.5"
                  >
                    <span>More details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 5 Quick Level Clickers */}
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => onUpdateProficiency(skill.skill, lvl)}
                      className={`flex-1 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        skill.current_level === lvl
                          ? 'bg-[#18191E] text-white shadow-2xs scale-102'
                          : 'bg-[#F1F5F9] text-slate-600 hover:bg-[#FEE883] hover:text-[#18191E]'
                      }`}
                      title={getLevelLabel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {activeModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#18191E]/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-[#CBD5E1] rounded-[32px] p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <span className="text-xs font-extrabold text-[#FF5B37] uppercase tracking-wider">Skill Details</span>
                <h2 className="text-xl font-black text-[#18191E]">{activeModalSkill.skill}</h2>
              </div>
              <button
                onClick={() => setActiveModalSkill(null)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="font-extrabold text-[#18191E]">Target Standard:</div>
                <p className="text-slate-600 leading-relaxed">
                  Requires <strong>Level {activeModalSkill.required_level}/4</strong> ({getLevelLabel(activeModalSkill.required_level)}) for <strong>{analysis.target_job_title}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="font-extrabold text-[#18191E]">Growth Recommendation:</div>
                <p className="text-slate-600 leading-relaxed">{getCleanTip(activeModalSkill)}</p>
              </div>

              {/* Quick Update Proficiency Buttons */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                <div className="font-extrabold text-[#18191E] flex items-center justify-between">
                  <span>Calibrate Your Level:</span>
                  <span className="text-[#FF5B37] font-black">{getLevelLabel(activeModalSkill.current_level)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        onUpdateProficiency(activeModalSkill.skill, lvl);
                        setActiveModalSkill({
                          ...activeModalSkill,
                          current_level: lvl,
                          gap: Math.max(0, activeModalSkill.required_level - lvl),
                          status: lvl >= activeModalSkill.required_level ? 'demonstrated' : (lvl > 0 ? 'needs_improvement' : 'missing'),
                        });
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        activeModalSkill.current_level === lvl
                          ? 'bg-[#18191E] text-white shadow-xs'
                          : 'bg-white border border-[#CBD5E1] text-slate-700 hover:bg-[#FEE883] hover:text-[#18191E]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
              <button
                onClick={() => {
                  setActiveModalSkill(null);
                  onNavigateToRoadmap();
                }}
                className="btn-coral px-5 py-2.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Study in Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveModalSkill(null)}
                className="px-5 py-2.5 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#18191E] text-xs font-extrabold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
