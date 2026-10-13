import React, { useState, useEffect } from 'react';
import { Sidebar, TopHeader } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { ResumeJobAnalysis } from './components/ResumeJobAnalysis';
import { CareerIntelligenceDashboard } from './components/CareerIntelligenceDashboard';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { PersonalizedRoadmap } from './components/PersonalizedRoadmap';
import { CareerExplorer } from './components/CareerExplorer';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { CuteChatbot } from './components/CuteChatbot';
import { AboutUs } from './components/AboutUs';

import {
  CandidateProfile,
  TargetJob,
  SkillGapAnalysisResponse,
  CareerRoadmap,
  ProgressSummary,
} from './types/api';
import { api } from './services/api';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('pathpilot_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal Login state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalIsRegister, setLoginModalIsRegister] = useState<boolean>(false);

  // Active view: start on overview (Home Page)
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Data State
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [targetJob, setTargetJob] = useState<TargetJob | null>(null);
  const [analysis, setAnalysis] = useState<SkillGapAnalysisResponse | null>(null);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [careers, setCareers] = useState<TargetJob[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadUserData = async () => {
    try {
      const loadedCareers = await api.getCareers().catch(() => []);
      setCareers(loadedCareers);

      if (!currentUser) {
        setProfile(null);
        setTargetJob(null);
        setAnalysis(null);
        setRoadmap(null);
        setProgress(null);
        setLoading(false);
        return;
      }

      const [
        loadedProfile,
        loadedActiveJob,
        loadedAnalysis,
        loadedRoadmap,
        loadedProgress,
      ] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getActiveCareer().catch(() => null),
        api.getCurrentAnalysis().catch(() => null),
        api.getRoadmap().catch(() => null),
        api.getProgressSummary().catch(() => null),
      ]);

      setProfile(loadedProfile);
      setTargetJob(loadedActiveJob);
      setAnalysis(loadedAnalysis);
      setRoadmap(loadedRoadmap);
      setProgress(loadedProgress);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    if (!currentUser && activeTab !== 'overview' && activeTab !== 'about') {
      setActiveTab('overview');
    }
  }, [currentUser]);

  const handleOpenLogin = (isRegister: boolean = false) => {
    setLoginModalIsRegister(isRegister);
    setIsLoginModalOpen(true);
  };

  const handleTabChange = (tab: string) => {
    if (!currentUser && tab !== 'overview' && tab !== 'about') {
      handleOpenLogin(false);
      showToast('Please sign in or create an account to access this workspace.');
      return;
    }
    setActiveTab(tab);
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setActiveTab('dashboard');
    showToast(`Welcome, ${user.name}! Loaded your personal career workspace.`);
  };

  const handleSignOut = () => {
    localStorage.removeItem('pathpilot_token');
    localStorage.removeItem('pathpilot_user');
    setCurrentUser(null);
    setProfile(null);
    setTargetJob(null);
    setAnalysis(null);
    setRoadmap(null);
    setProgress(null);
    setActiveTab('overview');
    showToast('Signed out of PathPilot.');
  };

  const handleResetDemo = async () => {
    setLoading(true);
    try {
      await api.resetDemo();
      const demoUser = {
        name: 'Alex Morgan',
        email: 'alex.morgan@university.edu',
        headline: 'Junior CS Student | Aspiring AI/ML Engineer',
        role: 'Student / Candidate'
      };
      localStorage.setItem('pathpilot_token', 'demo_token');
      localStorage.setItem('pathpilot_user', JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      await loadUserData();
      setActiveTab('dashboard');
      showToast('Sample benchmark initialized for Alex Morgan.');
    } catch (err) {
      console.error(err);
      showToast('Error resetting sample profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMilestone = async (milestoneId: string, completed: boolean) => {
    if (!currentUser) {
      handleOpenLogin(false);
      showToast('Please sign in to save your learning progress.');
      return;
    }
    try {
      const updatedRoadmap = await api.toggleMilestone(milestoneId, completed);
      setRoadmap(updatedRoadmap);
      const updatedProgress = await api.getProgressSummary();
      setProgress(updatedProgress);
      showToast(completed ? 'Milestone marked complete! Progress saved.' : 'Milestone marked incomplete.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecalculateHours = async (weeklyHours: number) => {
    try {
      const updated = await api.generateRoadmap(weeklyHours);
      setRoadmap(updated);
      showToast(`Roadmap schedule updated for ${weeklyHours} study hours/week (~${updated.estimated_weeks} weeks).`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProficiency = async (skillName: string, newLevel: number) => {
    try {
      const updatedAnalysis = await api.updateSkillProficiency(skillName, newLevel);
      setAnalysis(updatedAnalysis);
      const updatedProfile = await api.getProfile();
      setProfile(updatedProfile);
      const updatedProgress = await api.getProgressSummary();
      setProgress(updatedProgress);
      const updatedRoadmap = await api.getRoadmap();
      setRoadmap(updatedRoadmap);
      showToast(`${skillName} updated to Level ${newLevel}. Readiness score recalculated to ${updatedAnalysis.readiness_score}%!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCareer = async (jobId: string) => {
    try {
      const selected = await api.selectCareer(jobId);
      setTargetJob(selected);
      const updatedAnalysis = await api.getCurrentAnalysis();
      setAnalysis(updatedAnalysis);
      const updatedRoadmap = await api.generateRoadmap(12);
      setRoadmap(updatedRoadmap);
      const updatedProgress = await api.getProgressSummary();
      setProgress(updatedProgress);
      showToast(`Active target role changed to: ${selected.title}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenSkillDetails = (skillName: string) => {
    setSelectedSkillName(skillName);
    setActiveTab('gaps');
  };

  return (
    <div className="min-h-screen bg-[#D5DFE8] p-2 sm:p-5 lg:p-7 flex flex-col justify-center font-sans antialiased text-[#18191E]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-3.5 rounded-2xl bg-[#18191E] text-white shadow-2xl flex items-center gap-2.5 text-xs max-w-md animate-fadeIn border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Learnify Master Tablet Frame */}
      <div className="learnify-frame max-w-[1440px] w-full mx-auto min-h-[92vh] flex flex-row overflow-hidden">
        {/* Left Vertical Dark Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          currentUser={currentUser}
          targetRole={targetJob?.title || 'Junior AI/ML Engineer'}
          onOpenLogin={handleOpenLogin}
          onSignOut={handleSignOut}
        />

        {/* Right White Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <TopHeader
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            currentUser={currentUser}
            targetRole={targetJob?.title || 'Junior AI/ML Engineer'}
            onOpenLogin={handleOpenLogin}
            onSignOut={handleSignOut}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {loading && (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <div className="text-xs text-slate-400">Loading PathPilot AI...</div>
          </div>
        )}

        {!loading && (
          <div key={activeTab} className="page-transition min-h-full">
            {/* HOME / LANDING PAGE: First view shown */}
            {activeTab === 'overview' && (
              <LandingPage
                onNavigate={handleTabChange}
                onLoadDemo={handleResetDemo}
                onOpenLogin={handleOpenLogin}
                currentUser={currentUser}
                readinessScore={analysis?.readiness_score || 42}
                targetRole={targetJob?.title || 'Junior AI/ML Engineer'}
              />
            )}

            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <CareerIntelligenceDashboard
                analysis={analysis}
                targetJob={targetJob}
                roadmap={roadmap}
                onNavigate={setActiveTab}
                onOpenSkillDetails={handleOpenSkillDetails}
              />
            )}

            {/* ANALYZE RESUME & JOB */}
            {activeTab === 'analyze' && (
              <ResumeJobAnalysis
                profile={profile}
                targetJob={targetJob}
                predefinedJobs={careers}
                onProfileUpdated={setProfile}
                onTargetJobUpdated={setTargetJob}
                onRunAnalysis={async () => {
                  setLoading(true);
                  try {
                    const res = await api.getCurrentAnalysis();
                    setAnalysis(res);
                    const road = await api.getRoadmap();
                    setRoadmap(road);
                    const prog = await api.getProgressSummary();
                    setProgress(prog);
                    setActiveTab('dashboard');
                    showToast('Feature extraction & gap analysis complete!');
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            )}

            {/* SKILL GAPS */}
            {activeTab === 'gaps' && (
              <SkillGapAnalysis
                analysis={analysis}
                selectedSkillName={selectedSkillName}
                onUpdateProficiency={handleUpdateProficiency}
                onNavigateToRoadmap={() => setActiveTab('roadmap')}
              />
            )}

            {/* ROADMAP & RESOURCES */}
            {activeTab === 'roadmap' && (
              <PersonalizedRoadmap
                roadmap={roadmap}
                onToggleMilestone={handleToggleMilestone}
                onRecalculateHours={handleRecalculateHours}
                onNavigateBack={() => setActiveTab('dashboard')}
              />
            )}

            {/* CAREER EXPLORER */}
            {activeTab === 'careers' && (
              <CareerExplorer
                careers={careers}
                activeJob={targetJob}
                onSelectCareer={handleSelectCareer}
                onNavigateToAnalysis={() => setActiveTab('analyze')}
              />
            )}

            {/* PROGRESS ANALYTICS */}
            {activeTab === 'progress' && (
              <ProgressAnalytics
                progress={progress}
                profile={profile}
                targetJob={targetJob}
                analysis={analysis}
                onUpdateProficiency={handleUpdateProficiency}
                onNavigateToRoadmap={() => setActiveTab('roadmap')}
              />
            )}

            {/* ABOUT US / OUR TEAM */}
            {activeTab === 'about' && (
              <AboutUs
                onNavigateToTracks={() => handleTabChange('dashboard')}
              />
            )}
          </div>
        )}
          </main>

          {/* Clean Footer inside Learnify Workspace */}
          <footer className="w-full border-t border-[#F1F5F9] bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#18191E]">PathPilot</span>
              <span>•</span>
              <span>Personalized AI Career & Skill Navigator</span>
              <span>•</span>
              <button
                onClick={() => handleTabChange('about')}
                className="hover:text-[#FF5B37] font-semibold transition-colors underline underline-offset-2"
              >
                Our Team
              </button>
            </div>
            <div className="text-[11px] text-slate-400">
              Built with precision by Sobia Sattar, Muhammad Hassan & Sumra Shar.
            </div>
          </footer>
        </div>
      </div>

      {/* LOGIN / SIGNUP MODAL */}
      {isLoginModalOpen && (
        <LoginPage
          initialIsRegister={loginModalIsRegister}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      {/* Cute AI Career Buddy Chatbot (Pip) */}
      <CuteChatbot
        currentUser={currentUser}
        targetRole={targetJob?.title || 'Junior AI/ML Engineer'}
        readinessScore={analysis?.readiness_score || 42}
        missingSkills={analysis?.skill_analysis?.filter(s => s.gap > 0).map(s => s.skill) || ['Machine Learning', 'PyTorch', 'Model Evaluation']}
        activeMilestone={roadmap?.milestones?.[0]?.title || 'Establish Foundations in Python'}
      />
    </div>
  );
}

export default App;
