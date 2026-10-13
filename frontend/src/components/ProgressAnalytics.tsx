import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  Sparkles,
  History,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Check,
  Layers,
  Zap,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ProgressSummary, CandidateProfile, TargetJob, SkillGapAnalysisResponse } from '../types/api';

interface ProgressAnalyticsProps {
  progress: ProgressSummary | null;
  profile: CandidateProfile | null;
  targetJob?: TargetJob | null;
  analysis?: SkillGapAnalysisResponse | null;
  onUpdateProficiency: (skillName: string, newLevel: number) => void;
  onNavigateToRoadmap: () => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  progress,
  profile,
  targetJob,
  analysis,
  onUpdateProficiency,
  onNavigateToRoadmap,
}) => {
  const [selectedSkillToUpgrade, setSelectedSkillToUpgrade] = useState<string>('');
  const [newProficiencyTarget, setNewProficiencyTarget] = useState<number>(2);

  // Fallback curated skills by role to guarantee the dropdown and matrix never show "empty"
  const defaultSkillsByRole: Record<string, string[]> = {
    'Full-Stack Developer': [
      'JavaScript (ES6+)', 'React', 'HTML & CSS', 'FastAPI', 'PostgreSQL',
      'REST APIs', 'Git & GitHub', 'Node.js', 'Docker', 'TypeScript'
    ],
    'Junior AI/ML Engineer': [
      'Python', 'Machine Learning', 'Data Analysis', 'PyTorch Framework',
      'Model Evaluation & Metrics', 'SQL & Databases', 'Feature Engineering', 'FastAPI API Serving'
    ],
    'Data Analyst & BI Specialist': [
      'SQL Queries', 'Python (Pandas)', 'PowerBI / Tableau', 'Exploratory Data Analysis',
      'Business KPI Modeling', 'Statistical Testing', 'Excel Advanced Modeling'
    ]
  };

  // Compile full comprehensive list of available skills
  const availableSkills = useMemo(() => {
    const map = new Map<string, { name: string; level: number; category: string }>();

    // 1. From Analysis
    if (analysis?.skill_analysis) {
      analysis.skill_analysis.forEach((s) => {
        map.set(s.skill, { name: s.skill, level: s.current_level, category: s.category || 'Core Skill' });
      });
    }

    // 2. From Candidate Profile
    if (profile?.skills) {
      profile.skills.forEach((s) => {
        const existing = map.get(s.name);
        map.set(s.name, {
          name: s.name,
          level: Math.max(s.proficiency, existing?.level || 0),
          category: s.category || 'Demonstrated'
        });
      });
    }

    // 3. From Target Job requirements
    if (targetJob?.required_skills) {
      targetJob.required_skills.forEach((r) => {
        if (!map.has(r.name)) {
          map.set(r.name, { name: r.name, level: 0, category: 'Must-Have Requirement' });
        }
      });
    }
    if (targetJob?.preferred_skills) {
      targetJob.preferred_skills.forEach((r) => {
        if (!map.has(r.name)) {
          map.set(r.name, { name: r.name, level: 0, category: 'Preferred' });
        }
      });
    }

    // 4. Default role-based skills if still sparse
    const roleKey = progress?.target_role || targetJob?.title || 'Full-Stack Developer';
    const roleDefaults = defaultSkillsByRole[roleKey] || defaultSkillsByRole['Full-Stack Developer'];
    roleDefaults.forEach((skillName) => {
      if (!map.has(skillName)) {
        map.set(skillName, { name: skillName, level: 0, category: 'Role Benchmark' });
      }
    });

    return Array.from(map.values());
  }, [profile, targetJob, analysis, progress]);

  // Set default selected skill if none chosen
  React.useEffect(() => {
    if (!selectedSkillToUpgrade && availableSkills.length > 0) {
      setSelectedSkillToUpgrade(availableSkills[0].name);
    }
  }, [availableSkills, selectedSkillToUpgrade]);

  if (!progress) {
    return (
      <div className="py-16 text-center space-y-4">
        <TrendingUp className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-extrabold text-[#18191E]">No Progress Logged Yet</h2>
        <p className="text-xs text-slate-500">Complete curriculum milestones or update skills to view your analytics.</p>
      </div>
    );
  }

  const handleSimulateUpgrade = () => {
    if (!selectedSkillToUpgrade) return;
    onUpdateProficiency(selectedSkillToUpgrade, newProficiencyTarget);
  };

  const getLevelLabel = (lvl: number) => {
    switch (lvl) {
      case 0: return 'Not Started';
      case 1: return 'Beginner';
      case 2: return 'Practical';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      default: return `Level ${lvl}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-4 space-y-8 animate-fadeIn text-[#18191E]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18191E] tracking-tight">
            Learning Progress & Activity
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track completed syllabus milestones, study hours invested, and real-time skill score changes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] text-[#18191E] shadow-2xs">
            Role: <strong>{progress.target_role}</strong>
          </span>
        </div>
      </div>

      {/* METRIC CARDS 4-GRID (Learnify Pastel Palette) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="card-pastel-yellow p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Readiness Score</span>
            <Target className="w-4 h-4 text-[#18191E]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#18191E]">{progress.readiness_score}%</div>
            <div className="text-[11px] font-bold text-slate-700 mt-1 truncate">Role: {progress.target_role}</div>
          </div>
        </div>

        <div className="card-pastel-lavender p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Milestones</span>
            <CheckCircle2 className="w-4 h-4 text-[#18191E]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#18191E]">
              {progress.completed_milestones} / {progress.total_milestones}
            </div>
            <div className="text-[11px] font-bold text-slate-700 mt-1">
              {progress.milestone_completion_rate}% achieved
            </div>
          </div>
        </div>

        <div className="card-pastel-sky p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Hours Invested</span>
            <Clock className="w-4 h-4 text-[#18191E]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#18191E]">{progress.completed_hours}h</div>
            <div className="text-[11px] font-bold text-slate-700 mt-1">{progress.remaining_hours}h remaining</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-5 rounded-3xl shadow-xs space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span>Must-Have Gaps</span>
            <Activity className="w-4 h-4 text-[#FF5B37]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#FF5B37]">{progress.must_have_gaps}</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-1">{progress.total_gaps} total gaps</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: SKILL PROFICIENCY UPGRADE SIMULATOR */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F1F5F9] gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FEE883] flex items-center justify-center text-[#18191E]">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#18191E]">Interactive Skill Level Upgrader</h2>
              <p className="text-xs text-slate-500">
                Pick any skill from your target benchmark to recalibrate your readiness score instantly
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F1F5F9] text-slate-700">
            {availableSkills.length} Verified Skills Available
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <select
            value={selectedSkillToUpgrade}
            onChange={(e) => setSelectedSkillToUpgrade(e.target.value)}
            className="w-full sm:w-80 p-3 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#18191E] focus:outline-none focus:border-[#FF5B37]"
          >
            {availableSkills.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} (Current: Level {s.level} - {getLevelLabel(s.level)})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600">New Level:</span>
            <select
              value={newProficiencyTarget}
              onChange={(e) => setNewProficiencyTarget(Number(e.target.value))}
              className="bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold text-[#18191E] rounded-xl p-2.5 focus:outline-none"
            >
              <option value={1}>Level 1 - Beginner (Coursework)</option>
              <option value={2}>Level 2 - Practical (Mini-Projects)</option>
              <option value={3}>Level 3 - Intermediate (Production Work)</option>
              <option value={4}>Level 4 - Advanced (Expert Mastery)</option>
            </select>
          </div>

          <button
            onClick={handleSimulateUpgrade}
            disabled={!selectedSkillToUpgrade}
            className="w-full sm:w-auto px-6 py-3 rounded-full btn-coral disabled:opacity-50 text-xs font-extrabold transition-all shadow-sm cursor-pointer"
          >
            Update & Recalculate Score
          </button>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE SKILL COMPETENCY MATRIX */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F1F5F9] gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-[#18191E]">Target Role Competency Matrix</h2>
            <p className="text-xs text-slate-500">
              Click any level directly to test instant score recalculation for {progress.target_role}:
            </p>
          </div>
          <button
            onClick={onNavigateToRoadmap}
            className="text-xs font-bold text-[#FF5B37] hover:text-[#e04825] flex items-center gap-1 transition-colors"
          >
            <span>View Roadmap Curriculum</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSkills.map((skill) => (
            <div
              key={skill.name}
              className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#18191E]">{skill.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    skill.level > 0 ? 'bg-[#DCFCE7] text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    Level {skill.level}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {getLevelLabel(skill.level)} • {skill.category}
                </div>
              </div>

              {/* Quick Level Selector Buttons */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">Quick Set:</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => onUpdateProficiency(skill.name, lvl)}
                      className={`w-6 h-6 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        skill.level === lvl
                          ? 'bg-[#18191E] text-white shadow-xs scale-105'
                          : 'bg-white border border-[#CBD5E1] text-slate-600 hover:bg-[#FEE883]'
                      }`}
                      title={`Set ${skill.name} to Level ${lvl}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: RECENT AUDIT HISTORY */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5 text-[#18191E] font-extrabold text-sm">
            <div className="w-8 h-8 rounded-xl bg-[#E0D4FD] flex items-center justify-center text-[#18191E]">
              <History className="w-4 h-4" />
            </div>
            <span>Recent Activity Log ({progress.recent_history.length})</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Automatic workspace sync</span>
        </div>

        <div className="space-y-2.5">
          {progress.recent_history.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No recent activity logged yet.</p>
          ) : (
            progress.recent_history.slice(0, 8).map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs hover:border-[#CBD5E1] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5B37]" />
                  <div>
                    <span className="font-extrabold text-[#18191E] uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] mr-2">
                      {evt.event_type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-600 font-mono text-[11px]">{evt.entity_id}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
