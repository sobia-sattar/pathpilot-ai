import {
  CandidateProfile,
  TargetJob,
  SkillGapAnalysisResponse,
  LearningResource,
  PortfolioProject,
  CareerRoadmap,
  CareerComparisonResponse,
  ProgressSummary
} from '../types/api';
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
  : '/api';

function getAuthHeaders(): Record<string, string> {
  try {
    const saved = localStorage.getItem('pathpilot_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u?.email) {
        return { 'X-User-Email': u.email };
      }
    }
  } catch {}
  return {};
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to sign in' }));
      throw new Error(err.detail || 'Sign in failed');
    }
    return res.json();
  },

  async register(name: string, email: string, password: string, headline?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, headline }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to create account' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async getAuthUser(): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) return null;
    return res.json();
  },

  // Parsing & Profile
  async parsePdfResume(file: File): Promise<CandidateProfile> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/parse/pdf`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to upload PDF' }));
      throw new Error(err.detail || 'PDF parsing failed');
    }
    return res.json();
  },

  async parseTextResume(text: string): Promise<CandidateProfile> {
    const res = await fetch(`${API_BASE}/parse/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to parse text' }));
      throw new Error(err.detail || 'Resume text parsing failed');
    }
    return res.json();
  },

  async parseJobDescription(text: string, title?: string): Promise<TargetJob> {
    const res = await fetch(`${API_BASE}/parse/job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ text, title }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to parse job description' }));
      throw new Error(err.detail || 'Job description parsing failed');
    }
    return res.json();
  },

  async saveProfile(profile: CandidateProfile): Promise<CandidateProfile> {
    const res = await fetch(`${API_BASE}/parse/profile/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to save profile');
    return res.json();
  },

  async getProfile(): Promise<CandidateProfile> {
    const res = await fetch(`${API_BASE}/analyze/profile`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to fetch candidate profile');
    return res.json();
  },

  // Analysis
  async getCurrentAnalysis(): Promise<SkillGapAnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyze/current`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to run skill gap analysis');
    return res.json();
  },

  async updateSkillProficiency(skillName: string, newProficiency: number, evidence?: string): Promise<SkillGapAnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyze/update-skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({
        skill_name: skillName,
        new_proficiency: newProficiency,
        evidence,
      }),
    });
    if (!res.ok) throw new Error('Failed to update skill proficiency');
    return res.json();
  },

  // Recommendations & Roadmaps
  async getResources(): Promise<LearningResource[]> {
    const res = await fetch(`${API_BASE}/recommendations/resources`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  async getProjects(): Promise<PortfolioProject[]> {
    const res = await fetch(`${API_BASE}/recommendations/projects`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async getRoadmap(weeklyHours: number = 12): Promise<CareerRoadmap> {
    const res = await fetch(`${API_BASE}/recommendations/roadmap?weekly_hours=${weeklyHours}`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to fetch career roadmap');
    return res.json();
  },

  async generateRoadmap(weeklyHours: number = 12): Promise<CareerRoadmap> {
    const res = await fetch(`${API_BASE}/recommendations/roadmap/generate?weekly_hours=${weeklyHours}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to generate roadmap');
    return res.json();
  },

  async toggleMilestone(milestoneId: string, completed: boolean): Promise<CareerRoadmap> {
    const res = await fetch(`${API_BASE}/recommendations/roadmap/milestone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({
        milestone_id: milestoneId,
        completed,
      }),
    });
    if (!res.ok) throw new Error('Failed to update milestone status');
    return res.json();
  },

  // Careers
  async getCareers(): Promise<TargetJob[]> {
    const res = await fetch(`${API_BASE}/careers`);
    if (!res.ok) throw new Error('Failed to fetch career benchmarks');
    return res.json();
  },

  async getActiveCareer(): Promise<TargetJob> {
    const res = await fetch(`${API_BASE}/careers/active`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to fetch active career');
    return res.json();
  },

  async selectCareer(jobId: string): Promise<TargetJob> {
    const res = await fetch(`${API_BASE}/careers/select/${jobId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to select career role');
    return res.json();
  },

  async compareCareers(role1Id: string, role2Id: string): Promise<CareerComparisonResponse> {
    const res = await fetch(`${API_BASE}/careers/compare?role_1_id=${role1Id}&role_2_id=${role2Id}`);
    if (!res.ok) throw new Error('Failed to compare careers');
    return res.json();
  },

  // Progress
  async getProgressSummary(): Promise<ProgressSummary> {
    const res = await fetch(`${API_BASE}/progress/summary`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error('Failed to fetch progress summary');
    return res.json();
  },

  // Demo
  async resetDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset demo state');
    return res.json();
  },

  async getDemoInfo(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/info`);
    if (!res.ok) throw new Error('Failed to fetch demo info');
    return res.json();
  },

  // Cute AI Chatbot (Pip)
  async sendChatMessage(message: string, context?: any): Promise<any> {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        message,
        target_role: context?.target_role,
        readiness_score: context?.readiness_score,
        missing_skills: context?.missing_skills,
        active_milestone: context?.active_milestone,
      }),
    });
    if (!res.ok) throw new Error('Chatbot request failed');
    return res.json();
  },
};
