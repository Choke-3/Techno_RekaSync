import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BarChart3, ClipboardList, Zap, Plus, 
  MoreVertical, Edit3, Trash2, User, MessageCircle, 
  Smartphone, Sparkles, Folders, CheckCircle, Archive
} from 'lucide-react';
import { Project, ViewType } from '../types';

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
  onSelectProject: (id: string) => void;
  projects: Project[];
  onOpenNewProjectModal: () => void;
  onDeleteProject: (id: string) => void;
  onUpdateProjectStatus: (id: string, status: 'Active' | 'Completed' | 'Archived') => void;
}

export default function Dashboard({
  onNavigate,
  onSelectProject,
  projects,
  onOpenNewProjectModal,
  onDeleteProject,
  onUpdateProjectStatus
}: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Completed' | 'Archived'>('All');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isAnimatingCount, setIsAnimatingCount] = useState(false);

  // Calculate the actual total swipes across all projects
  const actualSwipes = projects.reduce((total, p) => {
    return total + (p.assets?.reduce((sum, a) => sum + (a.totalSwipes || 0), 0) || 0);
  }, 0);

  // Calculate dynamic completed sessions across all projects
  const totalCompletedSessions = projects.reduce((total, p) => {
    if (!p.assets || p.assets.length === 0) return total;
    const maxSwipes = Math.max(...p.assets.map(a => a.totalSwipes || 0));
    return total + maxSwipes;
  }, 0);

  // Trigger brief highlight animation whenever there is a new swipe/response
  useEffect(() => {
    if (actualSwipes > 0) {
      setIsAnimatingCount(true);
      const timer = setTimeout(() => setIsAnimatingCount(false), 800);
      return () => clearTimeout(timer);
    }
  }, [actualSwipes]);

  // Filter projects based on selected tab
  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'All') return true;
    return project.status === activeFilter;
  });

  // Calculate dynamic dashboard statistics
  const totalProjects = projects.length;
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;

  const handleDropdownToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Return appropriate style icon based on project content
  const getProjectIcon = (project: Project) => {
    if (project.title.toLowerCase().includes('branding') || project.title.toLowerCase().includes('logo')) {
      return <Sparkles className="w-5 h-5 text-tertiary" />;
    } else if (project.title.toLowerCase().includes('app') || project.title.toLowerCase().includes('ui')) {
      return <Smartphone className="w-5 h-5 text-primary" />;
    }
    return <Folders className="w-5 h-5 text-secondary" />;
  };

  const getStatusBadgeClass = (status: 'Active' | 'Completed' | 'Archived') => {
    switch (status) {
      case 'Active':
        return 'bg-tertiary/10 text-tertiary border border-tertiary/20';
      case 'Completed':
        return 'bg-primary/10 text-primary border border-primary/20';
      case 'Archived':
        return 'bg-outline-variant/30 text-on-surface-variant border border-outline-variant/40';
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen text-on-surface space-y-12 select-none animate-fade-in">
      
      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Projects */}
        <div className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/60 hover:translate-y-[-2px] transition-all duration-300">
          <p className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Total Projects</p>
          <h3 className="text-3xl md:text-4.5xl font-headline font-black text-primary">{totalProjects}</h3>
          {totalProjects === 0 ? (
            <div className="mt-2.5 text-xs text-on-surface-variant font-medium flex items-center gap-1">
              Create a project to start tracking
            </div>
          ) : (() => {
            const now = new Date();
            const currentMonthStr = now.toLocaleDateString('en-GB', { month: 'short' });
            const currentYearStr = now.getFullYear().toString();
            const projectsThisMonth = projects.filter(p => {
              if (!p.createdDate) return false;
              const lower = p.createdDate.toLowerCase();
              return lower.includes(currentMonthStr.toLowerCase()) && lower.includes(currentYearStr);
            }).length;

            if (projectsThisMonth > 0) {
              return (
                <div className="mt-2.5 flex items-center gap-1 text-xs text-tertiary font-bold animate-fade-in">
                  <TrendingUp className="w-4 h-4 text-tertiary animate-pulse" /> 
                  +{projectsThisMonth} added this month
                </div>
              );
            } else {
              return (
                <div className="mt-2.5 flex items-center gap-1 text-xs text-on-surface-variant font-medium animate-fade-in">
                  <ClipboardList className="w-4 h-4 text-on-surface-variant/70" /> 
                  {totalProjects} {totalProjects === 1 ? 'project' : 'projects'} on record
                </div>
              );
            }
          })()}
        </div>

        {/* Active Projects */}
        <div className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/60 hover:translate-y-[-2px] transition-all duration-300">
          <p className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Active</p>
          <h3 className="text-3xl md:text-4.5xl font-headline font-black text-tertiary">
            {activeCount < 10 ? `0${activeCount}` : activeCount}
          </h3>
          <div className="mt-4.5 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: `${(activeCount / (totalProjects || 1)) * 100}%` }} />
          </div>
        </div>

        {/* Completed Projects */}
        <div className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/60 hover:translate-y-[-2px] transition-all duration-300">
          <p className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Completed</p>
          <h3 className="text-3xl md:text-4.5xl font-headline font-black text-on-surface">{completedCount}</h3>
          <p className="mt-2.5 text-xs text-on-surface-variant font-medium">Lifetime success</p>
        </div>

        {/* Total Responses with real-time feedback */}
        <div className="p-6 rounded-2xl bg-surface-container-high border border-outline-variant/60 hover:translate-y-[-2px] transition-all duration-300 relative overflow-hidden group">
          <div className="relative z-10 space-y-1">
            <p className="text-[10px] md:text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Responses</p>
            <h3 className={`text-2xl md:text-3.5xl font-headline font-black transition-all duration-500 ${isAnimatingCount ? 'scale-105 text-tertiary' : 'text-primary'}`}>
              {totalCompletedSessions.toLocaleString()} <span className="text-[11px] text-on-surface-variant font-medium select-none">({actualSwipes.toLocaleString()} swipes)</span>
            </h3>
            <div className="mt-4 flex items-center gap-1 text-xs text-primary font-bold">
              <Zap className="w-4 h-4 fill-primary" /> Real-time synchronized
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 duration-500">
            <MessageCircle className="w-24 h-24 text-on-surface-variant" />
          </div>
        </div>
      </section>

      {/* Projects Header & Filter tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4.5xl font-headline font-black tracking-tight text-on-surface">Your Projects</h1>
          
          {/* Navigation filter pills */}
          <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-1">
            {(['All', 'Active', 'Completed', 'Archived'] as const).map(filter => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 font-semibold text-xs md:text-sm transition-all focus:outline-none ${
                    isActive 
                      ? 'text-primary border-b-2 border-primary font-bold' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          onClick={onOpenNewProjectModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-xs rounded-xl hover:translate-y-[-2px] transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer w-full md:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid / Empty State */}
      {filteredProjects.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-outline-variant/60 rounded-2xl bg-surface-container/20 text-center space-y-4">
          <Folders className="w-16 h-16 text-outline opacity-40 shrink-0" />
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-bold font-headline">No projects found</h3>
            <p className="text-xs md:text-sm text-on-surface-variant max-w-sm mx-auto">There are no {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} projects inside your sandbox workspace yet.</p>
          </div>
          <button 
            onClick={onOpenNewProjectModal}
            className="text-primary font-bold text-xs underline hover:text-primary-container transition-colors cursor-pointer bg-transparent border-none"
          >
            Create one now to get started
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="p-6 rounded-2xl bg-surface-container border border-outline-variant/60 flex flex-col justify-between gap-6 hover:translate-y-[-3px] transition-all duration-300 shadow-lg group cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="h-11 w-11 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center relative">
                  {getProjectIcon(project)}
                  <span className="absolute -top-1 -right-1 text-[8px] font-black text-white bg-primary-container/20 px-1 rounded border border-primary/20 scale-90 select-none">
                    RS
                  </span>
                </div>

                {/* Card dropdown operations */}
                <div className="relative">
                  <button 
                    onClick={(e) => handleDropdownToggle(e, project.id)}
                    className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-all active:scale-95 cursor-pointer"
                    aria-label="Project Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeDropdownId === project.id && (
                    <div className="absolute right-0 mt-1.5 w-36 bg-surface-container-highest border border-outline-variant rounded-xl shadow-xl z-20 overflow-hidden">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(project.id);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-surface-variant transition-colors flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Open Detail
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Cycle status
                          const nextStatus = project.status === 'Active' ? 'Completed' : project.status === 'Completed' ? 'Archived' : 'Active';
                          onUpdateProjectStatus(project.id, nextStatus);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-surface-variant transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Toggle Status
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-error hover:bg-error/15 transition-colors flex items-center gap-2 border-t border-outline-variant/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg md:text-xl font-bold font-headline text-on-surface truncate group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                
                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                  <User className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span>{project.clientName}</span>
                </div>

                <div className="pt-1">
                  <span className={`status-badge text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadgeClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Card Footer detail */}
              <div className="mt-2 pt-4 border-t border-outline-variant/60 flex justify-between items-center text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5 font-medium">
                  <MessageCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-on-surface font-semibold">{project.assets.reduce((sum, a) => sum + (a.totalSwipes), 0) || 0} Swipes</span>
                </div>
                <span className="font-semibold">{project.createdDate}</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
