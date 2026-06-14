import React, { useState } from 'react';
import { 
  ArrowLeft, Edit3, ChevronDown, Check, ChevronRight, 
  Send, QrCode, Sparkles, Heart, Clock, Users, ShieldAlert,
  Calendar, Upload, Trash2, Plus, Info, BarChart3, AlertTriangle
} from 'lucide-react';
import { Project, ViewType, StyleAsset } from '../types';

interface ProjectDetailProps {
  onNavigate: (view: ViewType) => void;
  project: Project;
  onUpdateStatus: (status: 'Active' | 'Completed' | 'Archived') => void;
  onUpdateProject: (updated: Project) => void;
  onNotify: (msg: string, title?: string) => void;
}

export default function ProjectDetail({
  onNavigate,
  project,
  onUpdateStatus,
  onUpdateProject,
  onNotify
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'preference-report' | 'style-cards' | 'project-timeline'>('overview');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Invite team member
  const [inviteEmail, setInviteEmail] = useState('');
  const [tempTeam, setTempTeam] = useState<string[]>(project.team);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const initial = inviteEmail.split('@')[0].substring(0, 2).toUpperCase();
    setTempTeam([...tempTeam, initial]);
    setInviteEmail('');
    onNotify(`Dispatched collaboration workspace invitation to ${inviteEmail}.`, 'Member Invited');
  };

  // Add more mock images to Style Cards
  const handleSimulateAssetUpload = () => {
    const additionalAsset: StyleAsset = {
      id: `custom-asset-${Date.now()}`,
      title: 'Holographic Void',
      category: 'Cyber',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgMewkBk_qyLfL57LEeADT3AY6lqe4U6XGoaUauwDMrp1yW49Plo1nwCA65f7waiM1s9rOLD_yexfmc_fsLJa_hguKxacYwmkKQL7oIDc0ZxyRpig4jE9ln5eGDc_RRScRfUd8VBblv0eLFCOzcDBcqZs8RCMl2LvfmF6g_lQ6j5CJ0-cwBF2u9GjL_Ol3Ks-1YiKGFRqBIYxz1tnzAc9sxJkR0GZqV1L_ueqXznGk-VMSmHLItKtWGUr58UEm9HrjWsphaA3Jiv4',
      loveCount: 0,
      skipCount: 0,
      totalSwipes: 0
    };

    const updatedProject = {
      ...project,
      assets: [...project.assets, additionalAsset]
    };

    onUpdateProject(updatedProject);
    onNotify('Constructed new style asset card from uploaded attachment.', 'Asset Rendered');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleSimulateAssetUpload();
  };

  const handleDeleteAsset = (assetId: string) => {
    const updated = {
      ...project,
      assets: project.assets.filter(a => a.id !== assetId)
    };
    onUpdateProject(updated);
    onNotify('Style card asset removed from workspace.', 'Asset Removed');
  };

  const handleGenerateAiInsights = () => {
    onNotify(
      "Analyzing swiping consensus... Strong indicator found: 94% approval on Neon Synth indicates preference for High-con contrast elements. Recommendation: Prioritize 'Prism Glass' and 'Holographic Void' palettes over pastel guidelines.", 
      "Precision Insight Generated"
    );
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen text-on-surface animate-fade-in space-y-8 select-none">
      
      {/* Header card area */}
      <section className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2.5xl md:text-3.5xl font-headline font-black text-on-surface">{project.title}</h1>
            <button 
              onClick={() => onNotify('Project setting adjustments are locked in sandbox mode.', 'Read Only')}
              className="flex items-center gap-1 bg-transparent px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container transition-all active:scale-95 text-xs font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Info</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] md:text-xs font-semibold text-on-tertiary-container bg-tertiary-container/10 border border-tertiary-container/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Client: Studio Bloom
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-on-surface-variant bg-surface-container-high border border-outline-variant/40 px-3 py-1 rounded-full">
              Email: {project.clientEmail}
            </span>
            <span className="text-[10px] md:text-xs text-on-surface-variant font-medium">
              Created: {project.createdDate}
            </span>
          </div>
        </div>

        {/* Project Status Dropdown */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="flex items-center gap-2 bg-surface-container-high px-4 py-2.5 rounded-xl border border-outline-variant hover:border-primary transition-all active:scale-95 text-xs font-bold"
          >
            <span className={`w-2 h-2 rounded-full ${project.status === 'Active' ? 'bg-tertiary' : project.status === 'Completed' ? 'bg-primary' : 'bg-outline'}`} />
            <span>{project.status}</span>
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          </button>
          
          {statusDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-surface-container-highest border border-outline-variant rounded-xl shadow-xl z-30 overflow-hidden">
              {(['Active', 'Completed', 'Archived'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    onUpdateStatus(st);
                    setStatusDropdownOpen(false);
                    onNotify(`Updated project status mapping to ${st}.`, 'Status Saved');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface-container text-xs font-bold flex items-center justify-between"
                >
                  <span>{st}</span>
                  {project.status === st && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tabs navigation */}
      <nav className="flex border-b border-outline-variant/60 gap-8 text-xs md:text-sm font-semibold overflow-x-auto">
        {(['overview', 'preference-report', 'style-cards', 'project-timeline'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'overview' ? 'Overview' : tab === 'preference-report' ? 'Preference Report' : tab === 'style-cards' ? 'Style Cards' : 'Project Timeline';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 border-b-2 transition-all shrink-0 uppercase tracking-wide cursor-pointer ${
                isActive 
                  ? 'text-primary border-primary font-bold' 
                  : 'text-on-surface-variant border-transparent hover:text-on-surface'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* Overview tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Project Brief */}
            <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 md:p-8 space-y-3 shadow-md">
              <h3 className="text-base md:text-lg font-bold font-headline text-on-surface">Project Brief</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team selection */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-md">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Co-Designers</span>
                <div className="flex -space-x-1.5">
                  {tempTeam.map((initial, i) => (
                    <div 
                      key={i} 
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-surface-container text-white ${
                        i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-tertiary-container'
                      }`}
                    >
                      {initial}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-outline-variant/40 space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Invite to Team</label>
                  <form onSubmit={handleInvite} className="flex gap-2">
                    <input 
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="colleague@email.com"
                      type="email" 
                      className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary font-sans"
                    />
                    <button 
                      type="submit"
                      className="bg-primary text-on-primary font-bold px-4 py-1.5 rounded-lg text-xs hover:brightness-110 active:scale-95 transition-all select-none"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Milestones brief */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-3 shadow-md flex flex-col justify-between">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Next Milestone</span>
                <p className="text-xs md:text-sm text-on-surface font-semibold leading-relaxed">
                  Design presentational deck mapping minimalist metallic concepts &amp; layout components.
                </p>
                <div className="pt-4 border-t border-outline-variant/40 flex items-center gap-2 text-[10px] text-on-surface-variant font-bold">
                  <Calendar className="w-4 h-4 text-primary" /> Target: 12 June 2026
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-6 shadow-md h-fit">
            <h3 className="text-base md:text-lg font-bold font-headline text-on-surface">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('swipe')}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 rounded-xl font-bold text-xs hover:translate-y-[-1px] transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Open Swiper Feed</span>
              </button>
              
              <button 
                onClick={() => setShowQrCode(!showQrCode)}
                className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-on-surface py-3.5 rounded-xl border border-outline-variant/60 hover:bg-surface-container-highest transition-colors active:scale-95 text-xs font-bold cursor-pointer"
              >
                <QrCode className="w-4 h-4 select-none" />
                <span>{showQrCode ? "Hide QR Code" : "Show QR Code"}</span>
              </button>

              <button 
                onClick={handleGenerateAiInsights}
                className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-on-surface py-3.5 rounded-xl border border-outline-variant/60 hover:bg-surface-container-highest transition-colors active:scale-95 text-xs font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Insights</span>
              </button>

              {/* Expandable Mock QR code */}
              {showQrCode && (
                <div className="mt-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl flex flex-col items-center gap-2 animate-fade-in select-none">
                  <div className="bg-white p-2.5 rounded-xl">
                    <QrCode className="w-28 h-28 text-black stroke-[1.5]" />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Scan to Share Feed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preference Report tab content */}
      {activeTab === 'preference-report' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Main stats block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 relative overflow-hidden group">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">Total Sessions</span>
              <p className="text-3xl font-headline font-black text-primary mt-1">36</p>
              <p className="text-[10px] text-tertiary font-bold mt-2">+12% from last week</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 relative overflow-hidden group">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">Avg. Favorite Rate</span>
              <p className="text-3xl font-headline font-black text-tertiary mt-1">79%</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-2">Strong consensus consensus</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 relative overflow-hidden group">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">Avg. Session Duration</span>
              <p className="text-3xl font-headline font-black text-on-surface mt-1">3m 14s</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-2">Deep aesthetic evaluation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Loved Styles details */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">Styles They Loved</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.assets.filter(a => a.loveCount > 0).slice(0, 2).map((asset) => {
                  const lovePercentage = Math.round((asset.loveCount / (asset.totalSwipes || 1)) * 100);
                  return (
                    <div 
                      key={asset.id}
                      className="bg-surface-container border border-outline-variant/60 rounded-2xl overflow-hidden group hover:translate-y-[-2px] transition-all duration-300 shadow-md"
                    >
                      <div className="h-44 bg-surface-container-high relative overflow-hidden select-none">
                        <img 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 duration-500" 
                          alt={asset.title}
                          src={asset.imageUrl}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-app/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="text-xs font-semibold text-on-primary-container bg-primary-container/80 px-2.5 py-1 rounded-full border border-primary-container/40">
                            {asset.title}
                          </span>
                        </div>
                        <span className="absolute top-2 right-2 text-[8px] font-black text-white/50 bg-black/20 px-1 rounded select-none">
                          RekaSync
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-on-surface-variant uppercase">Liking Consensus</span>
                          <span className="text-tertiary">{lovePercentage}%</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-tertiary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${lovePercentage}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Style preference ranking metric bar-charts */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
                <h3 className="text-base md:text-lg font-bold font-headline text-on-surface">Style Categorical Ranking</h3>
                <div className="h-56 w-full flex items-end gap-4 md:gap-8 px-2 pt-6">
                  {[
                    { label: 'Neon Synth', score: '94%' },
                    { label: 'Prism Glass', score: '88%' },
                    { label: 'Void Tech', score: '62%' },
                    { label: 'Minimalist', score: '45%' },
                    { label: 'Others', score: '12%' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all" style={{ height: item.score }} />
                      <span className="text-[10px] text-on-surface-variant font-bold truncate w-full text-center">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Disliked cards */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-md">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Rejected concepts</h3>
                <div className="grid grid-cols-2 gap-3 select-none">
                  <div className="relative group/disc aspect-video bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/40">
                    <img 
                      className="w-full h-full object-cover opacity-30 grayscale" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA90s-i_rj21PlwjmKSV_AXMBYCxzfBFWvexAO8NVQDg8BgRr4L63I5mdswN39Tn2_dzkKr6i4BKZhLXiOclG8M4FqKUT5Yn0lio5gx7YlVlkrNoNX9CrjAZIIj9L8trOLRSpFDSFumykgsZ8Oj62nbBJvW9xLll4wXw1zzJXa1UzjVPRz9aE2NX_wVwKop9hNm_LxVBKSMPo3VOXw_vscnHxBZcpU3U9Ra1ukowKEo2shlbYvpH-oNban22-Kntc_hl6Uc5a_GLuE" 
                      alt="Rejected soft conceptual direction"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-error/20 opacity-100 md:opacity-0 group-hover/disc:opacity-100 transition-opacity">
                      <ShieldAlert className="w-5 h-5 text-error" />
                    </div>
                  </div>

                  <div className="relative group/disc aspect-video bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/40">
                    <img 
                      className="w-full h-full object-cover opacity-30 grayscale" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuC2Zv2GceoAm4VtcSUqA3ANm2oGd378q9Mf2UroX6SS5EX1wxUrXAZwgNbE8NsB_PnTtex4yzFkrYJXTUkBVrbGL-BwtwULsR2p4tj22Z1ufrDpjgdk5IhqcBYmIZzY5yMY613sfNfgMOKSDc_8FFEOweM6raJ3bwb0T7vWlmfkoJEw6KzWwdMarhfYHE3oDiywupuJxgET0EMlsmqc4wxIBXzUR7qGaX6VnI7sfgYjojbbl-MvvCr-d1AqiIOhlHtcFuC_8vXQg" 
                      alt="Rejected oversaturated direction"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-error/20 opacity-100 md:opacity-0 group-hover/disc:opacity-100 transition-opacity">
                      <ShieldAlert className="w-5 h-5 text-error" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Sessions breakdown */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Client Sessions</h3>
                  <button onClick={() => onNotify('All historical feedback nodes loaded.', 'Audit Trail')} className="text-xs font-bold text-primary hover:underline bg-transparent border-none">
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {[
                    { user: 'User #8421', desc: 'Active feedback loops', time: '2 mins ago' },
                    { user: 'User #7119', desc: 'Approved neon directives', time: '1 hour ago' },
                    { user: 'User #2203', desc: 'Skipped pastel configurations', time: 'Yesterday' }
                  ].map((ses, sid) => (
                    <div key={sid} className="p-3 bg-surface-container-high hover:bg-surface-container-highest rounded-xl flex items-center justify-between transition-colors cursor-pointer group">
                      <div>
                        <p className="text-xs font-bold text-on-surface">{ses.user}</p>
                        <p className="text-[10px] text-on-surface-variant truncate font-medium">{ses.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Locked Export Banner */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-3 shadow-sm">
                <Lock className="w-8 h-8 text-primary mx-auto animate-pulse" />
                <h4 className="text-xs font-bold text-on-surface">Export Detailed PDF Report</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Join our enterprise upgrade plan waiting list to unlock advanced reporting logs.
                </p>
                <button 
                  disabled
                  className="w-full bg-primary/40 text-on-primary-container py-2.5 rounded-lg text-xs font-bold cursor-not-allowed uppercase"
                >
                  Export Workspace Config
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Style Cards tab content */}
      {activeTab === 'style-cards' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-base md:text-lg font-bold font-headline select-none">Style Workspace Cards</h3>
            <button 
              onClick={handleSimulateAssetUpload}
              className="flex items-center gap-1.5 bg-surface-container px-4 py-2 rounded-xl border border-outline-variant hover:border-primary transition-all text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add More Asset Photos</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {project.assets.map((asset) => (
              <div 
                key={asset.id}
                className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden group relative hover:translate-y-[-2px] transition-all shadow-md flex flex-col justify-between"
              >
                <div className="aspect-square relative overflow-hidden bg-surface-container-low select-none">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 duration-500" 
                    alt={asset.title}
                    src={asset.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="bg-surface-container-lowest/80 p-1.5 rounded-lg border border-outline-variant hover:bg-error transition-colors hover:text-white"
                      aria-label="Delete asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[8px] font-black text-white/50 bg-black/20 px-1 rounded select-none">
                    RekaSync
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <p className="text-xs font-bold text-on-surface truncate">{asset.title}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{asset.category}</p>
                </div>
              </div>
            ))}

            {/* Drag & Drop simulated upload box */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleSimulateAssetUpload}
              className="bg-surface-container-low border-2 border-dashed border-outline-variant/60 rounded-2xl aspect-square flex flex-col items-center justify-center gap-2.5 hover:border-primary hover:bg-surface-container/20 transition-all group cursor-pointer"
            >
              <Upload className="w-8 h-8 text-on-surface-variant group-hover:text-primary group-hover:scale-110 transition-all shrink-0" />
              <div className="text-center space-y-0.5 px-3 select-none">
                <span className="block text-xs font-bold text-on-surface group-hover:text-primary transition-colors">Drag &amp; drop files</span>
                <span className="block text-[10px] text-on-surface-variant font-medium">Or click to select layout images</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Timeline tab content */}
      {activeTab === 'project-timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in select-none">
          <div className="lg:col-span-4 space-y-6 animate-fade-in">
            <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 space-y-4 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-base md:text-lg font-bold font-headline mb-1">Gantt Chart Roadmap</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Map and anchor your project milestones with targeted Gantt chart schedules.
                </p>
              </div>

              {/* Simulated Gantt upload drop zone */}
              <div className="border-2 border-dashed border-outline-variant rounded-xl aspect-video flex flex-col items-center justify-center gap-2 hover:border-primary cursor-pointer transition-all group">
                <Upload className="w-7 h-7 text-outline group-hover:text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">Upload Schedule</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 md:p-8 space-y-6 shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-lg font-bold font-headline select-none text-on-surface">Timeline Calendar</h3>
                <button 
                  onClick={() => onNotify('New milestone initialized for timeline calendar.', 'Milestone Set')}
                  className="flex items-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-xl font-bold text-xs hover:translate-y-[-1px] transition-all active:scale-95 shadow-md shadow-primary/10 select-none cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>

              {/* Days Grid Calendar matching screenshot */}
              <div className="grid grid-cols-7 gap-px bg-outline-variant/60 border border-outline-variant/80 rounded-2xl overflow-hidden shadow-inner">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="bg-surface-container-low py-2 text-center text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-wider">
                    {day}
                  </div>
                ))}

                {/* Day blocks seed matching actual month layout */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-surface-container-lowest p-2 min-h-[72px] text-[10px] md:text-xs text-on-surface-variant/30 font-medium cursor-not-allowed">
                    {28 + i}
                  </div>
                ))}

                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isTargetMilestone = day === 12;
                  return (
                    <div 
                      key={day} 
                      onClick={() => onNotify(`Calendar detail logged for June ${day}.`, `Day ${day} logs`)}
                      className={`p-2 min-h-[72px] text-[10px] md:text-xs text-on-surface hover:bg-surface-container-high cursor-pointer transition-colors border-t border-r border-outline-variant/20 flex flex-col justify-between ${
                        isTargetMilestone ? 'bg-primary/10 ring-1 ring-primary/30' : 'bg-surface-container-lowest'
                      }`}
                    >
                      <span className={isTargetMilestone ? 'font-black text-primary' : 'font-semibold'}>
                        {day}
                      </span>
                      {isTargetMilestone && (
                        <div className="mt-1 text-[8px] md:text-[9px] leading-tight text-primary font-bold">
                          Concept Presentation
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
