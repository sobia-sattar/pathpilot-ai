import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  Sparkles,
  Info,
  Check,
  Bookmark
} from 'lucide-react';
import { TargetJob, CareerComparisonResponse } from '../types/api';
import { api } from '../services/api';

interface CareerExplorerProps {
  careers: TargetJob[];
  activeJob: TargetJob | null;
  onSelectCareer: (jobId: string) => void;
  onNavigateToAnalysis: () => void;
}

export const CareerExplorer: React.FC<CareerExplorerProps> = ({
  careers,
  activeJob,
  onSelectCareer,
  onNavigateToAnalysis,
}) => {
  const [role1Id, setRole1Id] = useState(careers[0]?.id || 'job_aiml_junior');
  const [role2Id, setRole2Id] = useState(careers[1]?.id || 'job_data_analyst');
  const [comparison, setComparison] = useState<CareerComparisonResponse | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  useEffect(() => {
    if (role1Id && role2Id) {
      loadComparison();
    }
  }, [role1Id, role2Id]);

  const loadComparison = async () => {
    if (role1Id === role2Id) return;
    setLoadingComparison(true);
    try {
      const res = await api.compareCareers(role1Id, role2Id);
      setComparison(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComparison(false);
    }
  };

  const getCardStyle = (index: number) => {
    if (index % 3 === 0) return 'card-pastel-yellow';
    if (index % 3 === 1) return 'card-pastel-lavender';
    return 'card-pastel-sky';
  };

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-4 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18191E] tracking-tight">
            Career Path Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore industry benchmark roles, examine required competencies, and plan transitions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] text-[#18191E] shadow-2xs">
            {careers.length} Verified Roles
          </span>
        </div>
      </div>

      {/* SECTION 1: PREDEFINED CAREER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {careers.map((career, idx) => {
          const isActive = activeJob?.id === career.id;
          const cardClass = getCardStyle(idx);

          return (
            <div
              key={career.id}
              className={`${cardClass} p-6 rounded-3xl flex flex-col justify-between space-y-5 shadow-xs transition-all hover:scale-[1.01]`}
            >
              <div className="space-y-3.5">
                {/* Header Pills */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#18191E] text-white">
                    {career.experience_level || 'Entry-Level'}
                  </span>
                  {isActive ? (
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#FFD233] text-[#18191E] flex items-center gap-1 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Active Target</span>
                    </span>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/70 flex items-center justify-center text-[#18191E]/60">
                      <Bookmark className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[#18191E] leading-snug">
                    {career.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-700/80 mt-0.5">
                    {career.company}
                  </div>
                </div>

                <p className="text-xs text-slate-800/90 line-clamp-3 leading-relaxed">
                  {career.description}
                </p>

                {/* Core skills chip list */}
                <div className="space-y-2 pt-2 border-t border-black/10">
                  <div className="text-[11px] text-slate-900 font-bold">Must-Have Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {career.required_skills.slice(0, 4).map((req) => (
                      <span
                        key={req.name}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 text-[#18191E] shadow-2xs"
                      >
                        {req.name} (L{req.required_level})
                      </span>
                    ))}
                    {career.required_skills.length > 4 && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-black/10 text-slate-800">
                        +{career.required_skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectCareer(career.id)}
                  disabled={isActive}
                  className={`w-full py-2.5 rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    isActive
                      ? 'bg-[#18191E] text-white cursor-default'
                      : 'btn-coral'
                  }`}
                >
                  <span>{isActive ? 'Current Active Target' : 'Select Target Role'}</span>
                  {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: CROSS-CAREER COMPARISON TOOL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FEE883] flex items-center justify-center text-[#18191E]">
              <GitCompare className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#18191E]">Side-by-Side Career Comparator</h2>
              <p className="text-xs text-slate-500">
                Compare overlapping competencies and evaluate transition feasibility
              </p>
            </div>
          </div>
        </div>

        {/* Role Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#18191E]">Base Career (Role 1):</label>
            <select
              value={role1Id}
              onChange={(e) => setRole1Id(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#18191E] focus:outline-none focus:border-[#FF5B37]"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#18191E]">Target Career (Role 2):</label>
            <select
              value={role2Id}
              onChange={(e) => setRole2Id(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#18191E] focus:outline-none focus:border-[#FF5B37]"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Output */}
        {comparison && (
          <div className="space-y-6 pt-4 border-t border-[#F1F5F9]">
            {/* Transition Readiness Bar */}
            <div className="p-5 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#18191E]">
                  Skill Transferability & Transition Readiness:
                </span>
                <span className="text-[#FF5B37] font-black text-base">
                  {comparison.transition_readiness}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className="h-full bg-[#FF5B37] rounded-full transition-all duration-500"
                  style={{ width: `${comparison.transition_readiness}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {comparison.transition_advice}
              </p>
            </div>

            {/* Overlap & Unique Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-xs">
              {/* Overlapping */}
              <div className="p-5 rounded-3xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-3">
                <div className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Shared Competencies ({comparison.overlapping_skills.length})</span>
                </div>
                <div className="space-y-2">
                  {comparison.overlapping_skills.map((s) => (
                    <div
                      key={s.skill}
                      className="p-2.5 rounded-2xl bg-white border border-emerald-200 flex items-center justify-between shadow-2xs"
                    >
                      <span className="text-[#18191E] font-bold">{s.skill}</span>
                      <span className="text-[10px] font-semibold text-emerald-700">
                        L{s.role_1_level} ↔ L{s.role_2_level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unique to Role 1 */}
              <div className="p-5 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="font-extrabold text-[#18191E]">
                  Unique to {comparison.role_1_title} ({comparison.unique_to_role_1.length})
                </div>
                <div className="space-y-2">
                  {comparison.unique_to_role_1.map((s) => (
                    <div
                      key={s.skill}
                      className="p-2.5 rounded-2xl bg-white border border-[#CBD5E1] flex items-center justify-between shadow-2xs"
                    >
                      <span className="text-slate-700 font-semibold">{s.skill}</span>
                      <span className="text-[10px] font-bold text-slate-500">Lvl {s.required_level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unique to Role 2 */}
              <div className="p-5 rounded-3xl bg-[#FFF7ED] border border-[#FFEDD5] space-y-3">
                <div className="font-extrabold text-amber-900">
                  Must Acquire for {comparison.role_2_title} ({comparison.unique_to_role_2.length})
                </div>
                <div className="space-y-2">
                  {comparison.unique_to_role_2.map((s) => (
                    <div
                      key={s.skill}
                      className="p-2.5 rounded-2xl bg-white border border-amber-200 flex items-center justify-between shadow-2xs"
                    >
                      <span className="text-[#18191E] font-bold">{s.skill}</span>
                      <span className="text-[10px] font-extrabold text-[#FF5B37]">
                        Lvl {s.required_level} ({s.priority})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curated Disclaimer */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs text-slate-500 flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-[#18191E]">Curated Industry Standard Profiles:</strong> These job profiles represent normalized industry benchmarks compiled for candidate career direction and skill-gap exploration.
        </span>
      </div>
    </div>
  );
};
