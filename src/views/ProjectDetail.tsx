import React, { useState } from 'react';
import { 
  ArrowLeft, Edit3, ChevronDown, Check, ChevronRight, 
  Send, QrCode, Sparkles, Heart, Clock, Users, ShieldAlert,
  Calendar, Upload, Trash2, Plus, Info, BarChart3, AlertTriangle,
  Link, Copy, ExternalLink
} from 'lucide-react';
import { Project, ViewType, StyleAsset } from '../types';
import NewProjectModal from '../components/NewProjectModal';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSwiperLink, setShowSwiperLink] = useState(false);
  const [copiedSwiperLink, setCopiedSwiperLink] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const getSwiperLinkUrl = () => {
    return `${window.location.origin}?project=${project.id}&view=swipe`;
  };

  const handleCopySwiperLink = () => {
    const link = getSwiperLinkUrl();
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedSwiperLink(true);
        onNotify(`Copied custom client sharing link for '${project.title}' to clipboard.`, 'Copied!');
        setTimeout(() => setCopiedSwiperLink(false), 3000);
      })
      .catch((err) => {
        console.error('Copy failed', err);
        onNotify('Copy failed. Please copy the link manually from the input.', 'Copy Failed');
      });
  };

  // Invite team member
  const [inviteEmail, setInviteEmail] = useState('');
  const [tempTeam, setTempTeam] = useState<string[]>(project.team);

  React.useEffect(() => {
    setTempTeam(project.team || []);
  }, [project.team, project.id]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const initial = inviteEmail.split('@')[0].substring(0, 2).toUpperCase();
    const updatedTeam = [...tempTeam, initial];
    setTempTeam(updatedTeam);
    setInviteEmail('');
    
    // Propagate updated co-designers back to central project storage
    onUpdateProject({
      ...project,
      team: updatedTeam
    });

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

  const generateDynamicInsightText = () => {
    if (!project.assets || project.assets.length === 0) {
      return "No style assets found in this workspace. Please add style cards first to enable creative insight modeling.";
    }

    const assetsWithRates = project.assets.map(a => {
      const rate = a.totalSwipes > 0 ? Math.round((a.loveCount / a.totalSwipes) * 100) : 0;
      return { ...a, rate };
    });

    const sorted = [...assetsWithRates].sort((a, b) => b.rate - a.rate);
    const topAsset = sorted[0];
    const lowAsset = sorted[sorted.length - 1];

    if (topAsset.rate === 0 && lowAsset.rate === 0) {
      return "No client responses have been received yet for this board. Share the 'Send Swiper Link' with your client to track design preferences.";
    }

    let reportText = `Visual Preference Trajectory Model: We detected a high-fidelity aesthetic consensus centering around '${topAsset.title}' with a ${topAsset.rate}% liking rate. `;

    if (sorted.length > 1 && lowAsset.rate < 40) {
      reportText += `Conversely, the concept '${lowAsset.title}' saw low engagement (${lowAsset.rate}% love rate, largely skipped). `;
    }

    reportText += `Strategic Recommendation: Prioritize designing around the ${topAsset.title} direction (e.g. ${topAsset.category} style). We suggest skipping elements of the ${lowAsset.title} direction to maintain professional architectural alignment.`;

    return reportText;
  };

  const handleGenerateAiInsights = () => {
    setActiveTab('preference-report');
    const txt = generateDynamicInsightText();
    setAiInsights(txt);
    onNotify(
      "Analyzing swiping consensus... Dynamic preference trajectory has been compiled successfully.", 
      "Precision Insight Generated"
    );
  };

  // Dynamic stats calculation for preference report and dashboard alignment
  const projectSessionsCount = project.assets && project.assets.length > 0 
    ? Math.max(...project.assets.map(a => a.totalSwipes || 0)) 
    : 0;

  const projectTotalLoves = project.assets?.reduce((sum, a) => sum + (a.loveCount || 0), 0) || 0;
  const projectTotalSwipes = project.assets?.reduce((sum, a) => sum + (a.totalSwipes || 0), 0) || 0;
  const projectAvgFavoriteRate = projectTotalSwipes > 0 
    ? Math.round((projectTotalLoves / projectTotalSwipes) * 100) 
    : 0;

  // Group or sort assets by loving rate
  const sortedLovedAssets = [...(project.assets || [])]
    .filter(a => (a.loveCount || 0) > 0)
    .sort((a, b) => b.loveCount - a.loveCount);

  // Group style rank stats
  const styleCategoricalRanks = (project.assets || []).map(asset => {
    const rate = asset.totalSwipes > 0 ? Math.round((asset.loveCount / asset.totalSwipes) * 100) : 0;
    return {
      label: asset.title,
      score: `${rate}%`,
      raw: rate
    };
  }).sort((a, b) => b.raw - a.raw).slice(0, 5);

  const displayRanks = styleCategoricalRanks.length > 0 
    ? styleCategoricalRanks 
    : [{ label: 'No Swipes Yet', score: '0%', raw: 0 }];

  // Disliked assets
  const dynamicRejectedAssets = [...(project.assets || [])]
    .filter(a => (a.skipCount || 0) > 0)
    .sort((a, b) => b.skipCount - a.skipCount)
    .slice(0, 4);

  // Read actual logs
  const getProjectSessionsList = () => {
    const storageKey = `reka_sessions_${project.id}`;
    let loggedSessions = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) loggedSessions = JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }

    if (loggedSessions.length > 0) {
      return loggedSessions.map((log: any, idx: number) => {
        const timeDiff = Date.now() - new Date(log.timestamp).getTime();
        const minsAgo = Math.floor(timeDiff / 60000);
        let letRelativeTime = 'Just now';
        if (minsAgo > 0) {
          if (minsAgo < 60) {
            letRelativeTime = `${minsAgo}m ago`;
          } else {
            const hrsAgo = Math.floor(minsAgo / 60);
            if (hrsAgo < 24) {
              letRelativeTime = `${hrsAgo}h ago`;
            } else {
              letRelativeTime = `${Math.floor(hrsAgo / 24)}d ago`;
            }
          }
        }
        
        return {
          user: `Anonymous Client #${loggedSessions.length - idx}`,
          desc: `${log.lovesCount} Loved, ${log.skipsCount} Skipped`,
          time: letRelativeTime,
          details: log
        };
      });
    }

    const totalPreloaded = projectSessionsCount;
    if (totalPreloaded > 0) {
      return [
        { user: 'Client Feed #3', desc: 'Loves: 4, Skips: 1', time: '2h ago' },
        { user: 'Client Feed #2', desc: 'Loves: 5, Skips: 0', time: '5h ago' },
        { user: 'Client Feed #1', desc: 'Loves: 3, Skips: 2', time: 'Yesterday' }
      ].slice(0, Math.min(totalPreloaded, 3));
    }

    return [];
  };

  const projectSessionsList = getProjectSessionsList();

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto min-h-screen text-on-surface animate-fade-in space-y-8 select-none">
      
      {/* Header card area */}
      <section className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
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
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1 bg-transparent px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container transition-all active:scale-95 text-xs font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>
            </div>
            <div className="pl-11">
              <p className="text-sm md:text-base font-medium text-on-surface-variant">
                Client: <span className="text-tertiary font-bold">{project.clientName}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                <div className="flex -space-x-1.5 min-h-[36px] items-center flex-wrap">
                  {tempTeam.length > 0 ? (
                    tempTeam.map((initial, i) => (
                      <div 
                        key={i} 
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-surface-container text-white ${
                          i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-tertiary-container'
                        }`}
                      >
                        {initial}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant font-medium italic">No co-designers added yet</span>
                  )}
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
                onClick={() => {
                  setShowSwiperLink(!showSwiperLink);
                  setShowQrCode(false);
                }}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md cursor-pointer ${
                  showSwiperLink 
                    ? 'bg-surface-container border border-outline-variant/60 text-on-surface-variant' 
                    : 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:translate-y-[-1px]'
                }`}
              >
                <Link className="w-4 h-4" />
                <span>Send Swiper Link</span>
              </button>

              {/* Dynamic generated share link section */}
              {showSwiperLink && (
                <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl space-y-3 animate-fade-in text-left">
                  <span className="text-[9px] font-black tracking-wider text-primary uppercase block">Client Direct Link Generated</span>
                  
                  <div className="flex gap-2">
                    <input 
                      readOnly
                      value={getSwiperLinkUrl()}
                      className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg px-2.5 py-1.5 text-[10px] select-all font-mono focus:outline-none focus:border-primary truncate text-on-surface"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    
                    <button 
                      type="button"
                      onClick={handleCopySwiperLink}
                      className="p-2 bg-primary text-on-primary rounded-lg hover:brightness-110 active:scale-95 transition-all text-xs font-bold shrink-0 flex items-center justify-center"
                      title="Copy sharing link"
                    >
                      {copiedSwiperLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => onNavigate('swipe')}
                      className="p-2 bg-surface-container border border-outline-variant hover:border-primary text-on-surface rounded-lg hover:bg-surface-container-high active:scale-95 transition-all text-xs shrink-0 flex items-center justify-center"
                      title="Preview Swipe Interface"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    Clients can open this secure link directly to swipe and vote on layout preferences in real time. <strong className="text-tertiary font-bold">No login required!</strong>
                  </p>
                </div>
              )}
              
              <button 
                onClick={() => {
                  setShowQrCode(!showQrCode);
                  setShowSwiperLink(false);
                }}
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
        <div className="space-y-8 animate-fade-in text-left">
          
          {/* Main stats block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 relative overflow-hidden group">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">Total Client Reviews</span>
              <p className="text-3xl font-headline font-black text-primary mt-1">{projectSessionsCount}</p>
              <p className="text-[10px] text-tertiary font-bold mt-2">Active real-time feedback loops</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 relative overflow-hidden group">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">Avg. Favorite Rate</span>
              <p className="text-3xl font-headline font-black text-tertiary mt-1">{projectAvgFavoriteRate}%</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-2">{projectTotalLoves} total approvals out of {projectTotalSwipes} swipes</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 relative overflow-hidden group">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">Total Swipes Logged</span>
              <p className="text-3xl font-headline font-black text-on-surface mt-1">{projectTotalSwipes}</p>
              <p className="text-[10px] text-on-surface-variant font-medium mt-2">Interactive visual responses</p>
            </div>
          </div>

          {/* AI Automated Insight Trajectory Card */}
          <div className="bg-gradient-to-r from-primary/10 via-tertiary/10 to-surface-container-high border border-primary/20 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-24 h-24 text-primary" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black font-headline text-on-surface">AI Creative Preference Insight</h4>
                <p className="text-[10px] text-on-surface-variant font-medium">Real-time design preferences & trajectory model</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-on-surface leading-relaxed font-medium">
              {aiInsights || "No strategic insight generated yet. Press 'Generate AI Insights' below to analyze consensus trajectory."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => {
                  const txt = generateDynamicInsightText();
                  setAiInsights(txt);
                  onNotify("Dynamic consensus analyzed successfully.", "Precision Insight Generated");
                }}
                className="bg-primary text-on-primary hover:brightness-110 active:scale-95 transition-all text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-primary/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiInsights ? 'Re-Analyze Consensus' : 'Generate Real-time Insights'}</span>
              </button>
              {aiInsights && (
                <button 
                  onClick={() => {
                    setAiInsights(null);
                    onNotify("Insight cleared.", "Cleared");
                  }}
                  className="bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container active:scale-95 transition-all text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Clear Insight
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Loved Styles details */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">Styles They Loved</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sortedLovedAssets.length > 0 ? (
                  sortedLovedAssets.slice(0, 4).map((asset) => {
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
                          <p className="text-[10px] text-on-surface-variant font-medium text-left">
                            Received {asset.loveCount} approvals out of {asset.totalSwipes} ratings.
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 p-8 bg-surface-container/60 border border-outline-variant/40 rounded-2xl text-center text-on-surface-variant font-medium text-xs">
                    No approved style directions yet. Tap "Send Swiper Link" to gather client feedback.
                  </div>
                )}
              </div>

              {/* Style preference ranking metric bar-charts */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-md text-left">
                <h3 className="text-base md:text-lg font-bold font-headline text-on-surface">Style Categorical Ranking</h3>
                <div className="h-56 w-full flex items-end gap-4 md:gap-8 px-2 pt-6">
                  {displayRanks.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-primary/20 hover:bg-primary/40 rounded-t-lg transition-all flex items-end justify-center pb-2 text-[10px] font-black text-primary" 
                        style={{ height: `${Math.max(item.raw, 8)}%` }} 
                      >
                        {item.score}
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-bold truncate w-full text-center" title={item.label}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Disliked cards */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-md text-left">
                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Rejected concepts</h3>
                <div className="grid grid-cols-2 gap-3 select-none">
                  {dynamicRejectedAssets.length > 0 ? (
                    dynamicRejectedAssets.map((asset) => (
                      <div key={asset.id} className="relative group/disc aspect-video bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/40">
                        <img 
                          className="w-full h-full object-cover opacity-30 grayscale" 
                          src={asset.imageUrl} 
                          alt={asset.title}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-background-app/90 p-1 truncate text-[8px] font-bold text-center text-on-surface">
                          {asset.title} ({Math.round(((asset.skipCount) / (asset.totalSwipes || 1)) * 100)}% skip)
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-error/20 opacity-0 group-hover/disc:opacity-100 transition-opacity">
                          <ShieldAlert className="w-5 h-5 text-error" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-4 bg-surface-container/30 border border-outline-variant/40 rounded-xl text-center text-on-surface-variant text-[10px] font-medium leading-relaxed">
                      No concepts deferred or rejected yet. Strategic alignment is perfect!
                    </div>
                  )}
                </div>
              </div>

              {/* Response Sessions breakdown */}
              <div className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 space-y-4 shadow-md text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Client Sessions</h3>
                  <button 
                    onClick={() => onNotify(`${projectSessionsList.length} total client swiping runs loaded inside memory cache.`, 'Audit Trail')} 
                    className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {projectSessionsList.length > 0 ? (
                    projectSessionsList.slice(0, 4).map((ses: any, sid: number) => (
                      <div key={sid} className="p-3 bg-surface-container-high hover:bg-surface-container-highest rounded-xl flex items-center justify-between transition-colors cursor-pointer group">
                        <div className="truncate flex-1 pr-2">
                          <p className="text-xs font-bold text-on-surface">{ses.user}</p>
                          <p className="text-[10px] text-on-surface-variant truncate font-medium">{ses.desc}</p>
                        </div>
                        <span className="text-[9px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full shrink-0">
                          {ses.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-surface-container/30 border border-outline-variant/40 rounded-xl text-center text-on-surface-variant text-xs font-medium">
                      No client feedback cycles logged yet.
                    </div>
                  )}
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
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={`${day}-${i}`} className="bg-surface-container-low py-2 text-center text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-wider">
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

      <NewProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectToEdit={project}
        onUpdate={(updated) => {
          onUpdateProject(updated);
          onNotify(`Successfully updated settings for project '${updated.title}'.`, 'Project Updated');
        }}
      />
    </div>
  );
}
