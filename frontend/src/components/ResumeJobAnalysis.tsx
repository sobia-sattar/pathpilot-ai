import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Info,
  Check
} from 'lucide-react';
import { CandidateProfile, TargetJob, CandidateSkill } from '../types/api';
import { api } from '../services/api';

interface ResumeJobAnalysisProps {
  profile: CandidateProfile | null;
  targetJob: TargetJob | null;
  onProfileUpdated: (profile: CandidateProfile) => void;
  onTargetJobUpdated: (job: TargetJob) => void;
  onRunAnalysis: () => void;
  predefinedJobs: TargetJob[];
}

export const ResumeJobAnalysis: React.FC<ResumeJobAnalysisProps> = ({
  profile,
  targetJob,
  onProfileUpdated,
  onTargetJobUpdated,
  onRunAnalysis,
  predefinedJobs,
}) => {
  const [activeResumeTab, setActiveResumeTab] = useState<'upload' | 'paste'>('upload');
  const [pastedResumeText, setPastedResumeText] = useState(profile?.raw_text || '');
  const [activeJobTab, setActiveJobTab] = useState<'predefined' | 'custom'>('predefined');
  const [customJobText, setCustomJobText] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('Machine Learning Engineer');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New skill addition state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(2);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a valid PDF document.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setStatusMessage(`Extracting features from ${file.name}...`);

    try {
      const parsedProfile = await api.parsePdfResume(file);
      onProfileUpdated(parsedProfile);
      setPastedResumeText(parsedProfile.raw_text || '');
      setStatusMessage('Resume parsed successfully! Review and confirm extracted skills below.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error extracting text from PDF. You can paste your resume text below.');
    } finally {
      setLoading(false);
    }
  };

  const handlePastedResumeSubmit = async () => {
    if (!pastedResumeText.trim() || pastedResumeText.length < 20) {
      setErrorMessage('Please paste at least 20 characters of resume text.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setStatusMessage('Analyzing and extracting technical competencies...');

    try {
      const parsed = await api.parseTextResume(pastedResumeText);
      onProfileUpdated(parsed);
      setStatusMessage('Skills extracted! Review and adjust proficiency estimates below.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process resume text.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleResume = () => {
    const sampleText = `Alex Morgan
alex.morgan@university.edu | GitHub: github.com/alex-morgan

OBJECTIVE
Motivated junior computer science student seeking an internship or entry-level role in Machine Learning and Data Engineering.

EDUCATION
Bachelor of Science in Computer Science | State University
Expected Graduation: May 2026 | GPA: 3.7/4.0
Relevant Coursework: Data Structures & Algorithms, Intro to Machine Learning, Database Systems, Linear Algebra, Statistics & Probability.

TECHNICAL SKILLS
Languages: Python, SQL
Libraries & Tools: Pandas, Matplotlib, Git, GitHub
Foundations: Data Cleaning, Exploratory Data Analysis, Linear Regression, Basic Statistics

PROJECTS
Student Academic Performance Analysis
• Cleaned tabular demographic dataset of 1,000 student records using Pandas and Numpy
• Plotted exploratory charts using Matplotlib to assess study hour correlations
• Trained an introductory baseline regression model to predict exam grades

Campus Library Database System
• Designed normalized relational database schema with tables for inventory, patrons, and checkouts
• Wrote SQL join queries and group-by aggregations for inventory status reports

EXPERIENCE
Undergraduate Teaching Assistant | State University (Sept 2025 - Present)
• Assisted 40+ students in introductory Python programming labs and assignments`;

    setPastedResumeText(sampleText);
    setActiveResumeTab('paste');
  };

  const handleSelectPredefinedJob = async (jobId: string) => {
    setLoading(true);
    try {
      const selected = await api.selectCareer(jobId);
      onTargetJobUpdated(selected);
      setStatusMessage(`Target benchmark set to: ${selected.title}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to select career.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomJobSubmit = async () => {
    if (!customJobText.trim() || customJobText.length < 20) {
      setErrorMessage('Please provide a valid job description text.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setStatusMessage('Parsing job requirements and classifying priorities...');

    try {
      const job = await api.parseJobDescription(customJobText, customJobTitle);
      onTargetJobUpdated(job);
      setStatusMessage(`Job parsed! Identified ${job.required_skills.length} must-have and ${job.preferred_skills.length} preferred skills.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse job description.');
    } finally {
      setLoading(false);
    }
  };

  const handleProficiencyChange = (skillIndex: number, newLevel: number) => {
    if (!profile) return;
    const updatedSkills = [...profile.skills];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      proficiency: newLevel,
      user_confirmed: true,
    };
    const updatedProfile = { ...profile, skills: updatedSkills };
    onProfileUpdated(updatedProfile);
  };

  const handleAddCustomSkill = () => {
    if (!newSkillName.trim() || !profile) return;
    const newSkill: CandidateSkill = {
      name: newSkillName.trim(),
      normalized_name: newSkillName.trim(),
      category: 'General',
      proficiency: newSkillLevel,
      evidence: 'Added manually during profile review',
      confidence: 1.0,
      is_inferred: false,
      user_confirmed: true,
    };
    const updatedProfile = {
      ...profile,
      skills: [...profile.skills, newSkill],
    };
    onProfileUpdated(updatedProfile);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillIndex: number) => {
    if (!profile) return;
    const updatedSkills = profile.skills.filter((_, idx) => idx !== skillIndex);
    onProfileUpdated({ ...profile, skills: updatedSkills });
  };

  const handleConfirmAndAnalyze = async () => {
    if (profile) {
      await api.saveProfile(profile);
    }
    onRunAnalysis();
  };

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-4 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18191E] tracking-tight">
          Profile & Target Role Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ingest your resume, select your target career goal, and verify extracted skills for precision gap calculation.
        </p>
      </div>

      {/* Notification Banners */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-3 text-xs text-emerald-800 font-semibold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-3 text-xs text-rose-800 font-semibold shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: INGESTION DUAL COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: CANDIDATE RESUME */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E0D4FD] flex items-center justify-center text-[#18191E]">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-[#18191E]">1. Candidate Resume</span>
            </div>
            <button
              onClick={handleLoadSampleResume}
              className="text-xs text-[#FF5B37] hover:text-[#e04825] font-bold flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Resume</span>
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1.5 rounded-2xl bg-[#F1F5F9] text-xs font-bold">
            <button
              onClick={() => setActiveResumeTab('upload')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeResumeTab === 'upload'
                  ? 'bg-[#18191E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#18191E]'
              }`}
            >
              Upload PDF
            </button>
            <button
              onClick={() => setActiveResumeTab('paste')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeResumeTab === 'paste'
                  ? 'bg-[#18191E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#18191E]'
              }`}
            >
              Paste Text
            </button>
          </div>

          {/* Upload PDF View */}
          {activeResumeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-[#CBD5E1] hover:border-[#FF5B37] rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all text-center group">
                <div className="w-12 h-12 rounded-2xl bg-[#FEE883] flex items-center justify-center text-[#18191E] mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-sm font-extrabold text-[#18191E]">Click or drag & drop resume PDF</span>
                <span className="text-xs text-slate-500 mt-1">Standard text-based PDF up to 10MB</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Files are processed in memory and never shared externally.</span>
              </p>
            </div>
          )}

          {/* Paste Resume View */}
          {activeResumeTab === 'paste' && (
            <div className="space-y-3">
              <textarea
                value={pastedResumeText}
                onChange={(e) => setPastedResumeText(e.target.value)}
                rows={9}
                placeholder="Paste complete resume or student bio text here..."
                className="w-full p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-[#FF5B37] font-mono leading-relaxed"
              />
              <button
                onClick={handlePastedResumeSubmit}
                disabled={loading}
                className="w-full py-3 rounded-full btn-coral text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>Extract Features From Text</span>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: TARGET JOB DESCRIPTION */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#BAE6FD] flex items-center justify-center text-[#18191E]">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-[#18191E]">2. Target Benchmark</span>
            </div>
            {targetJob && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#18191E] text-white">
                {targetJob.title}
              </span>
            )}
          </div>

          {/* Job Selection Tabs */}
          <div className="flex p-1.5 rounded-2xl bg-[#F1F5F9] text-xs font-bold">
            <button
              onClick={() => setActiveJobTab('predefined')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeJobTab === 'predefined'
                  ? 'bg-[#18191E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#18191E]'
              }`}
            >
              Standard Benchmarks
            </button>
            <button
              onClick={() => setActiveJobTab('custom')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeJobTab === 'custom'
                  ? 'bg-[#18191E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#18191E]'
              }`}
            >
              Paste Custom Role
            </button>
          </div>

          {/* Predefined Benchmarks */}
          {activeJobTab === 'predefined' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">Select a curated benchmark role profile:</p>
              <div className="space-y-2.5">
                {predefinedJobs.map((job) => {
                  const isSelected = targetJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() => handleSelectPredefinedJob(job.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#FEE883]/30 border-[#FFD233] shadow-xs'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-extrabold text-[#18191E]">{job.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {job.required_skills.length} must-have • {job.preferred_skills.length} preferred
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#18191E] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Job Paste */}
          {activeJobTab === 'custom' && (
            <div className="space-y-3">
              <input
                type="text"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                placeholder="Target Job Title (e.g. Associate Data Scientist)"
                className="w-full p-3 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-[#FF5B37]"
              />
              <textarea
                value={customJobText}
                onChange={(e) => setCustomJobText(e.target.value)}
                rows={6}
                placeholder="Paste full job posting with requirements, qualifications, and responsibilities..."
                className="w-full p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-[#FF5B37] font-mono leading-relaxed"
              />
              <button
                onClick={handleCustomJobSubmit}
                disabled={loading}
                className="w-full py-3 rounded-full btn-coral text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
                <span>Parse & Extract Requirements</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: HUMAN REVIEW & CORRECTION LAYER */}
      {profile && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F1F5F9] gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-[#18191E]">Review & Verify Extracted Skills</h2>
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#E0D4FD] text-[#18191E]">
                  Verification Layer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Candidate: <strong className="text-[#18191E]">{profile.name}</strong> • {profile.headline}
              </p>
            </div>

            <button
              onClick={handleConfirmAndAnalyze}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full btn-coral text-xs font-extrabold shadow-sm transition-all"
            >
              <span>Confirm & Run Gap Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scale Legend Note */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#FF5B37] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#18191E]">Proficiency Scale:</strong> Level 0: Unobserved • Level 1: Beginner / Coursework • Level 2: Practical Projects • Level 3: Intermediate / Work Experience • Level 4: Advanced Mastery.
            </span>
          </div>

          {/* Skill List with Evidence & Level Selectors */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Extracted Skills ({profile.skills.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {profile.skills.map((skill, index) => (
                <div
                  key={`${skill.name}-${index}`}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-extrabold text-[#18191E]">{skill.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-slate-600">
                          {skill.category}
                        </span>
                        {skill.user_confirmed && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F0FDF4] text-emerald-700 font-extrabold border border-emerald-300">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                        "{skill.evidence || 'Identified from candidate profile'}"
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Level Selector (0 - 4) */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E2E8F0]">
                    <span className="text-[11px] font-bold text-slate-500">Proficiency:</span>
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2, 3, 4].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => handleProficiencyChange(index, lvl)}
                          className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all ${
                            skill.proficiency === lvl
                              ? 'bg-[#18191E] text-white shadow-xs'
                              : 'bg-white border border-[#CBD5E1] text-slate-600 hover:bg-[#F1F5F9]'
                          }`}
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

          {/* Add Custom Skill Box */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Add another skill (e.g. Docker, PyTorch)..."
              className="flex-1 p-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-[#FF5B37]"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Level:</span>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="bg-white border border-[#CBD5E1] text-xs font-bold text-[#18191E] rounded-xl p-2 focus:outline-none"
              >
                <option value={1}>1 - Beginner</option>
                <option value={2}>2 - Practical</option>
                <option value={3}>3 - Intermediate</option>
                <option value={4}>4 - Advanced</option>
              </select>
              <button
                onClick={handleAddCustomSkill}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#18191E] hover:bg-black text-white text-xs font-extrabold transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
