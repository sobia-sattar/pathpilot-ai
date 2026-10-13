import React, { useState } from 'react';
import {
  BookOpen,
  FolderGit2,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import { LearningResource, PortfolioProject } from '../types/api';

interface ResourcesProjectsProps {
  resources: LearningResource[];
  projects: PortfolioProject[];
  onNavigateToRoadmap: () => void;
}

export const LearningResourcesAndProjects: React.FC<ResourcesProjectsProps> = ({
  resources,
  projects,
  onNavigateToRoadmap,
}) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'projects'>('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  // Extract unique skills from resources
  const availableSkills = Array.from(new Set(resources.map((r) => r.canonical_skill)));

  // Filtered resources
  const filteredResources = resources.filter((res) => {
    if (selectedDifficulty !== 'all' && res.difficulty !== selectedDifficulty) return false;
    if (selectedSkill !== 'all' && res.canonical_skill !== selectedSkill) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.topic.toLowerCase().includes(q) ||
        res.provider.toLowerCase().includes(q) ||
        res.canonical_skill.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered projects
  const filteredProjects = projects.filter((proj) => {
    if (selectedDifficulty !== 'all' && proj.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        proj.title.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        proj.skills_addressed.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Curated Learning Resources & Portfolio Projects</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Verified educational documentation, interactive tutorials, and resume-building projects mapped to skill deficits.
        </p>
      </div>

      {/* TABS: RESOURCES VS PROJECTS */}
      <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'resources' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curated Resources ({resources.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Portfolio Projects ({projects.length})</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5 text-xs focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Skill Dropdown (Only for Resources) */}
          {activeTab === 'resources' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Skill:</span>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-lg p-1.5 text-xs focus:outline-none max-w-xs truncate"
              >
                <option value="all">All Skills</option>
                {availableSkills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* TAB 1: CURATED RESOURCES GRID */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {res.canonical_skill}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {res.estimated_hours}h
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{res.is_free ? 'Free' : 'Paid'}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{res.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Provider: <strong className="text-slate-300">{res.provider}</strong> • Type: {res.resource_type}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Topic: {res.topic}
                </p>

                {res.why_recommended && (
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-indigo-200">
                    {res.why_recommended}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Difficulty: {res.difficulty}
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PORTFOLIO PROJECTS GRID */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{proj.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-semibold">
                      {proj.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Estimated Effort: <strong className="text-white">{proj.estimated_hours} Hours</strong>
                  </div>
                </div>

                <button
                  onClick={onNavigateToRoadmap}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  <span>View in Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {proj.description}
              </p>

              {/* Tech Stack Chips */}
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Tech Stack:</div>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverables List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-white">Deliverables to Showcase:</div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {proj.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-white">Suggested Milestones:</div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {proj.milestones.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
