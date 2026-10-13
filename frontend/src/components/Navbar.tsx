import React, { useState } from 'react';
import {
  Compass,
  FileText,
  LayoutDashboard,
  Target,
  MapPin,
  Briefcase,
  TrendingUp,
  LogOut,
  LogIn,
  UserPlus,
  Search,
  Bell,
  Headphones,
  Settings,
  Folder,
  Edit3,
  Menu,
  X,
  Users
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  targetRole: string;
  onOpenLogin: (isRegister?: boolean) => void;
  onSignOut: () => void;
}

/* ========================================================
   RONAS IT / LEARNIFY LEFT DARK VERTICAL SIDEBAR
   ======================================================== */
export const Sidebar: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onSignOut,
}) => {
  const navItems = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'dashboard', label: 'Tracks', icon: Folder },
    { id: 'analyze', label: 'Analyze', icon: Edit3 },
    { id: 'gaps', label: 'Skill Gaps', icon: Target },
    { id: 'roadmap', label: 'Roadmap', icon: MapPin },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'progress', label: 'Analytics', icon: TrendingUp },
    { id: 'about', label: 'Our Team', icon: Users },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center justify-between py-6 px-3 bg-[#18191E] text-white w-[72px] shrink-0 min-h-full">
      {/* Top Stack of Icons */}
      <div className="flex flex-col items-center gap-3 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-11 h-11 flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#FFD233] text-[#18191E] rounded-2xl shadow-md scale-105 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* Bottom Stack: Settings, Support, Auth */}
      <div className="flex flex-col items-center gap-3 w-full pt-4 border-t border-white/10">
        <button
          onClick={() => setActiveTab('careers')}
          title="Career Explorer"
          className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-[#FFD233] hover:bg-white/10 rounded-2xl transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>

        {currentUser ? (
          <button
            onClick={onSignOut}
            title="Sign Out"
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => onOpenLogin(false)}
            title="Sign In"
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-[#FFD233] hover:bg-white/10 rounded-2xl transition-all"
          >
            <LogIn className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};

/* ========================================================
   RONAS IT / LEARNIFY TOP HEADER BAR INSIDE WHITE WORKSPACE
   ======================================================== */
export const TopHeader: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  targetRole,
  onOpenLogin,
  onSignOut,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const userName = currentUser?.name || 'Alex Morgan';
  const userHandle = currentUser?.email ? currentUser.email.split('@')[0] : 'alex_morgan';

  const navItems = [
    { id: 'overview', label: 'Home' },
    { id: 'dashboard', label: 'Tracks & Gaps' },
    { id: 'analyze', label: 'Analyze Resume' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'careers', label: 'Careers' },
    { id: 'progress', label: 'Analytics' },
    { id: 'about', label: 'Our Team' },
  ];

  return (
    <header className="w-full bg-white border-b border-[#F1F5F9] px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand Welcome greeting matching Learnify */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <div className="text-sm sm:text-base font-normal text-slate-600 flex items-center gap-1.5">
              <span>Welcome to</span>
              <span className="font-extrabold text-[#18191E] tracking-tight text-lg sm:text-xl">
                Path<span className="text-[#FF5B37]">Pilot</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Learnify Pill Search Bar with Coral Button */}
        <div className="hidden sm:flex items-center relative max-w-xs md:max-w-sm w-full mx-4">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search skills, roles or roadmaps..."
            className="w-full pl-4 pr-11 py-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#18191E] placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
          <button
            type="button"
            className="absolute right-1 w-7 h-7 rounded-full bg-[#FF5B37] text-white flex items-center justify-center shadow-sm hover:bg-[#EE4B27] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Team Link, Notifications, User Profile, Auth */}
        <div className="flex items-center gap-3">
          {/* Quick Team Link */}
          <button
            onClick={() => setActiveTab('about')}
            title="Meet Our Team"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'about'
                ? 'bg-[#18191E] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-slate-700 hover:bg-[#FEE883] hover:text-[#18191E] border border-[#E2E8F0]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Our Team</span>
          </button>

          {/* Notification Bell */}
          <button
            title="Notifications"
            className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-slate-600 hover:text-black transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile matching Learnify right corner */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-200 to-orange-300 border-2 border-white shadow-sm flex items-center justify-center font-bold text-xs text-[#18191E] overflow-hidden">
                <span className="uppercase">
                  {userName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .substring(0, 2)}
                </span>
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <div className="font-bold text-[#18191E]">{userName}</div>
                <div className="text-[11px] text-slate-400 font-medium">@{userHandle}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin(false)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenLogin(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#FF5B37] hover:bg-[#EE4B27] text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden pt-4 mt-3 border-t border-slate-100 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                activeTab === item.id
                  ? 'bg-[#18191E] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          {currentUser && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onSignOut();
                  setMobileOpen(false);
                }}
                className="text-rose-600 font-medium text-xs"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export const Navbar = TopHeader;
