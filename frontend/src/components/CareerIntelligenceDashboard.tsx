import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Bookmark,
  Clock,
  BookOpen,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { SkillGapAnalysisResponse, TargetJob, CareerRoadmap } from '../types/api';

interface DashboardProps {
  analysis: SkillGapAnalysisResponse | null;
  targetJob: TargetJob | null;
  roadmap: CareerRoadmap | null;
  onNavigate: (tabId: string) => void;
  onOpenSkillDetails: (skillName: string) => void;
}

export const CareerIntelligenceDashboard: React.FC<DashboardProps> = ({
  analysis,
  targetJob,
  roadmap,
  onNavigate,
  onOpenSkillDetails,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);

  if (!analysis) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-3xl p-8 border border-slate-200">
        <Target className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-[#18191E]">No Analysis Generated Yet</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please upload your resume or select a target job blueprint to inspect your skill gaps.
        </p>
        <button
          onClick={() => onNavigate('analyze')}
          className="btn-coral px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Go to Analysis Workspace
        </button>
      </div>
    );
  }

  const categoryPills = ['All', 'Machine Learning', 'Data Science', 'Software Dev'];

  const demonstratedSkills = analysis.skill_analysis.filter((s) => s.status === 'demonstrated');
  const gapSkills = analysis.skill_analysis.filter((s) => s.gap > 0);
  const criticalGaps = gapSkills.slice(0, 5);

  const completedMilestones = roadmap?.milestones.filter((m) => m.completed).length || 0;
  const totalMilestones = roadmap?.milestones.length || 0;
  const milestoneProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // 3 Signature Cards Data matching Learnify Screenshot 1
  const signatureTracks = [
    {
      id: 'track_aiml',
      pill: 'Machine Learning',
      title: 'Junior AI/ML Engineer',
      domain: 'Artificial Intelligence',
      skillsCount: '5/20 skills',
      progressPercent: analysis.readiness_score || 42,
      colorClass: 'card-pastel-yellow',
      progressTrack: 'bg-[#18191E]',
      peers: '+120 candidates',
      avatars: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80']
    },
    {
      id: 'track_data',
      pill: 'Data Science',
      title: 'Data Analyst & BI Specialist',
      domain: 'Analytics & SQL',
      skillsCount: '12/50 skills',
      progressPercent: 68,
      colorClass: 'card-pastel-lavender',
      progressTrack: 'bg-[#7C3AED]',
      peers: '+80 candidates',
      avatars: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80']
    },
    {
      id: 'track_fullstack',
      pill: 'Software Dev',
      title: 'Full-Stack Web Engineer',
      domain: 'Web & APIs',
      skillsCount: '18/22 skills',
      progressPercent: 52,
      colorClass: 'card-pastel-sky',
      progressTrack: 'bg-[#0284C7]',
      peers: '+24 candidates',
      avatars: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80']
    }
  ];

  // Table rows for "My next roadmap milestones" matching Screenshot 1
  const nextLessons = [
    {
      index: '01',
      title: roadmap?.milestones[0]?.title || 'Machine Learning Fundamentals & Loss Functions',
      course: 'AI & Machine Learning Core',
      instructor: 'Dr. Conner Garcia',
      duration: '22 hrs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'
    },
    {
      index: '02',
      title: roadmap?.milestones[1]?.title || 'PyTorch Tensors, Backprop & Neural Architectures',
      course: 'Deep Learning Specialization',
      instructor: 'Saira Goodman',
      duration: '40 hrs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80'
    },
    {
      index: '03',
      title: roadmap?.milestones[2]?.title || 'Model Evaluation, ROC-AUC & Confusion Matrix',
      course: 'Applied Model Diagnostics',
      instructor: 'Tony Ware',
      duration: '18 hrs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80'
    },
    {
      index: '04',
      title: roadmap?.milestones[3]?.title || 'High-Throughput REST API Serving with FastAPI',
      course: 'Production ML Deployment',
      instructor: 'Mya Guzman',
      duration: '26 hrs',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80'
    },
    {
      index: '05',
      title: 'SQL Window Functions & Feature Pipeline Engineering',
      course: 'Data Operations & ETL',
      instructor: 'Zohaib Osborn',
      duration: '23 hrs',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#18191E]">
      {/* ========================================================= */}
      {/* 1. TOP HEADER ROW: TITLE + CATEGORY FILTER PILLS          */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18191E] tracking-tight">
            My career tracks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Target role: <strong>{analysis.target_job_title}</strong> • Benchmark readiness: <strong>{analysis.readiness_score}%</strong>
          </p>
        </div>

        {/* Category Pills matching Learnify Screenshot 1 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categoryPills.map((pill) => {
            const isActive = selectedCategoryFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setSelectedCategoryFilter(pill)}
                className={`whitespace-nowrap transition-all ${
                  isActive ? 'pill-filter-active' : 'pill-filter-inactive'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THREE SIGNATURE PASTEL CARDS (YELLOW, LAVENDER, SKY)   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {signatureTracks.map((track) => (
          <div
            key={track.id}
            className={`${track.colorClass} p-5 flex flex-col justify-between space-y-4 shadow-sm card-hover-effect rounded-[28px]`}>
            {/* Top row: Pill Tag + Bookmark Icon */}
            <div className="flex items-center justify-between">
              <span className="bg-[#18191E] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {track.pill}
              </span>
              <button className="text-[#18191E] hover:opacity-75 transition-opacity">
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-extrabold text-[#18191E] leading-snug line-clamp-2">
                {track.title}
              </h2>
            </div>

            {/* Progress Section */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#18191E]">
                <span>Progress</span>
                <span>{track.skillsCount}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/15 overflow-hidden">
                <div
                  className={`h-full ${track.progressTrack} rounded-full transition-all duration-700`}
                  style={{ width: `${track.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Bottom Row: Overlapping Avatars + Coral Continue Button */}
            <div className="flex items-center justify-between pt-2 border-t border-black/10">
              <div className="flex items-center -space-x-2">
                {track.avatars.map((av, i) => (
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
                onClick={() => onNavigate('roadmap')}
                className="btn-coral px-4 py-2 text-xs font-bold shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM TWO-COLUMN SECTION (WHITE TABLE + CHARCOAL CARD) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT / MAIN COLUMN: "My next lessons" / Roadmap Milestones */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-lg font-extrabold text-[#18191E]">My next lessons</h3>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs font-bold text-[#FF5B37] hover:text-[#EE4B27] transition-colors"
            >
              View all lessons
            </button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            <div className="col-span-7">Lesson</div>
            <div className="col-span-3">Teacher</div>
            <div className="col-span-2 text-right">Duration</div>
          </div>

          {/* Table Rows matching Screenshot 1 */}
          <div className="divide-y divide-[#F8FAFC]">
            {nextLessons.map((lesson) => (
              <div
                key={lesson.index}
                className="grid grid-cols-12 items-center py-3 px-3 rounded-2xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                onClick={() => onNavigate('roadmap')}
              >
                {/* Lesson Info */}
                <div className="col-span-7 pr-2">
                  <div className="text-xs font-bold text-[#18191E] group-hover:text-[#FF5B37] transition-colors line-clamp-1">
                    {lesson.index}. {lesson.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {lesson.course}
                  </div>
                </div>

                {/* Teacher / Instructor */}
                <div className="col-span-3 flex items-center gap-2">
                  <img
                    src={lesson.avatar}
                    alt={lesson.instructor}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate">
                    {lesson.instructor}
                  </span>
                </div>

                {/* Duration */}
                <div className="col-span-2 text-right text-xs font-bold text-[#18191E]">
                  {lesson.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CHARCOAL DARK CARD matching Learnify Screenshot 1 */}
        <div className="card-charcoal-dark p-6 space-y-6 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <span className="text-xs text-slate-400 font-medium block">
              New course matching your interests
            </span>

            <span className="inline-block bg-[#FFD233] text-[#18191E] font-bold text-xs px-3.5 py-1 rounded-full">
              Computer Science
            </span>

            <h3 className="text-xl font-black text-white leading-snug pt-1">
              Microsoft Future Ready: Fundamentals of Big Data & PyTorch
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Curated core requirement directly addressing your -2 level gap in <strong>PyTorch Framework</strong>.
            </p>
          </div>

          {/* Overlapping candidate avatars */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">They are already studying</span>
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-[#18191E] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-[#18191E] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-8 h-8 rounded-full border-2 border-[#18191E] object-cover"
                />
                <span className="w-8 h-8 rounded-full bg-[#FFD233] text-[#18191E] text-xs font-bold flex items-center justify-center border-2 border-[#18191E]">
                  +100
                </span>
              </div>
            </div>

            {/* Coral Action Button */}
            <button
              onClick={() => onNavigate('gaps')}
              className="btn-coral w-full py-3 text-sm font-bold shadow-md"
            >
              More details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
