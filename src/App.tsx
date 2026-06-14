import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NewProjectModal from './components/NewProjectModal';
import Landing from './views/Landing';
import Privacy from './views/Privacy';
import SignIn from './views/SignIn';
import SignUp from './views/SignUp';
import Profile from './views/Profile';
import Dashboard from './views/Dashboard';
import ProjectDetail from './views/ProjectDetail';
import SwipeClient from './views/SwipeClient';

import { INITIAL_PROJECTS } from './data';
import { Project, ViewType } from './types';
import { X, Sparkles, BellRing, Info, AlertCircle, Database } from 'lucide-react';
import { 
  testConnection, 
  getSupabaseProjects, 
  insertSupabaseProject, 
  updateSupabaseProject, 
  updateSupabaseProjectStatus, 
  deleteSupabaseProject,
  deleteAllSupabaseProjects,
  logoutUser,
  supabase
} from './lib/supabase';
import SupabaseSyncModal from './components/SupabaseSyncModal';


interface ToastState {
  message: string;
  title?: string;
  type?: 'success' | 'info' | 'warning';
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Supabase states
  const [supabaseStatus, setSupabaseStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [supabaseErrorMsg, setSupabaseErrorMsg] = useState<string | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  
  // Set default logged in state to null to force authentication
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl: string } | null>(null);

  useEffect(() => {
    // 1. Initial active session check on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const userMeta = session.user.user_metadata || {};
          const fallbackName = session.user.email?.split('@')[0] || 'User';
          const friendlyName = userMeta.full_name || (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1));
          
          setUser({
            name: friendlyName,
            email: session.user.email || '',
            avatarUrl: userMeta.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
          });

          // Redirect to dashboard on refresh if they are on a guest-only view
          setCurrentView(prev => {
            if (prev === 'signin' || prev === 'signup') {
              return 'dashboard';
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn('Session restoration failed:', err);
      }
    };

    checkSession();

    // 2. Continuous real-time subscription for Auth State Events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        const userMeta = session.user.user_metadata || {};
        const fallbackName = session.user.email?.split('@')[0] || 'User';
        const friendlyName = userMeta.full_name || (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1));
        
        setUser({
          name: friendlyName,
          email: session.user.email || '',
          avatarUrl: userMeta.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Page guarding effect: redirect unauthenticated users to signin when touching private views
  useEffect(() => {
    const PUBLIC_VIEWS: ViewType[] = ['landing', 'privacy', 'signin', 'signup', 'swipe'];
    if (!user && !PUBLIC_VIEWS.includes(currentView)) {
      triggerToast('Authentication is required first. Please sign in or create an account to access the workspace features.', 'Access Restricted', 'warning');
      setCurrentView('signin');
    }
  }, [currentView, user]);

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Automated Supabase Database Hydration Control
  const initSupabase = async () => {
    try {
      setSupabaseStatus('testing');
      const isConnected = await testConnection();
      if (isConnected) {
        setSupabaseStatus('connected');
        const supabaseProjects = await getSupabaseProjects();
        if (supabaseProjects && supabaseProjects.length > 0) {
          setProjects(supabaseProjects);
          triggerToast('Successfully fetched live project ledgers from your cloud Supabase database.', 'Supabase Online', 'success');
        } else {
          // Keep workspace completely empty! The user decided to start fresh with no dummy data.
          setProjects([]);
          triggerToast('Successfully connected to Supabase workspace. Your ledger is clean and ready!', 'Supabase Online', 'success');
        }
      } else {
        setSupabaseStatus('error');
        setSupabaseErrorMsg('Tables might not be initialized yet. Please make sure the SQL code is run.');
      }
    } catch (err: any) {
      console.warn("Supabase connection check failed:", err.message);
      setSupabaseStatus('error');
      setSupabaseErrorMsg(err.message || 'Connecting with Supabase REST API...');
    }
  };

  /**
   * Manually populate the active database with pre-packaged interactive demo metrics.
   */
  const handleSeedSampleProjects = async () => {
    try {
      setSupabaseStatus('testing');
      triggerToast('Populating your database with starter projects...', 'Seeding Started', 'info');
      
      // Clear current list to prevent duplicate primary keys in the session 
      if (supabaseStatus === 'connected') {
        await deleteAllSupabaseProjects();
      }

      // Insert all
      for (const proj of INITIAL_PROJECTS) {
        await insertSupabaseProject(proj);
      }
      
      const seededProjects = await getSupabaseProjects();
      setProjects(seededProjects);
      setSupabaseStatus('connected');
      triggerToast('Sandbox workspace successfully populated with modern style boards!', 'Seeding Complete', 'success');
    } catch (err: any) {
      console.error("Manual seed error:", err);
      setSupabaseStatus('error');
      triggerToast(err.message || 'Error populating starting records.', 'Seeding Failed', 'warning');
    }
  };

  /**
   * Wipe all active tables and clear runtime state completely to start fresh!
   */
  const handleWipeAllProjects = async () => {
    try {
      setSupabaseStatus('testing');
      if (supabaseStatus === 'connected') {
        await deleteAllSupabaseProjects();
      }
      setProjects([]);
      setSupabaseStatus('connected');
      triggerToast('All project metrics and tables have been purged. You have a completely blank workbench!', 'Workspace Cleared', 'success');
    } catch (err: any) {
      console.error("Wipe error:", err);
      setSupabaseStatus('error');
      triggerToast(err.message || 'Could not empty the ledger tables.', 'Wipe Failed', 'warning');
    }
  };

  useEffect(() => {
    initSupabase();
  }, []);
  
  // Parse deep sharing client link query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projId = params.get('project');
    const view = params.get('view');
    if (view === 'swipe' && projId) {
      const found = projects.find(p => p.id === projId);
      if (found) {
        setSelectedProjectId(projId);
        setCurrentView('swipe');
      }
    }
  }, [projects]);


  // Seed default notifications inside system index
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'New Survey Responses',
      body: 'Sarah Johnson swiped matching directions layout "Neon Synth"',
      time: '12 mins ago',
      read: false
    },
    {
      id: 'n2',
      title: 'Client Connection Successful',
      body: 'Studio Bloom opened custom client direction link',
      time: '1 hour ago',
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Clear toast timeout safely
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const triggerToast = (message: string, title?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, title, type });
  };

  // Handler for Demo Swiper Link
  const handleSetDemoProject = () => {
    const demoProj = projects.find(p => p.id === 'lumina-branding') || projects[0];
    if (demoProj) {
      setSelectedProjectId(demoProj.id);
      setCurrentView('swipe');
      triggerToast('Running Client Swipe Demo. Feel free to drag card components left/right or use A/D key shortcuts.', 'Demo Activated', 'info');
    }
  };

  // Notifications toggle triggers read updates
  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  // Project updating wrappers with Supabase sync
  const handleCreateProject = async (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    triggerToast(`Constructed and synchronized '${newProject.title}' project ledger.`, 'Workspace Generated');

    if (supabaseStatus === 'connected') {
      try {
        await insertSupabaseProject(newProject);
        triggerToast(`Project '${newProject.title}' synced with Supabase!`, 'Supabase Synced');
      } catch (err: any) {
        console.error("Supabase sync error:", err);
        triggerToast(`Local project created, but Supabase insert failed: ${err.message}`, 'Supabase Sync Error', 'warning');
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    const title = projects.find(p => p.id === id)?.title;
    setProjects(prev => prev.filter(p => p.id !== id));
    triggerToast(`Safely deleted project '${title || id}' from database.`, 'Project Purged', 'warning');

    if (supabaseStatus === 'connected') {
      try {
        await deleteSupabaseProject(id);
        triggerToast(`Deleted project from Supabase.`, 'Supabase Synced');
      } catch (err: any) {
        console.error("Supabase sync error:", err);
        triggerToast(`Failed to delete from Supabase: ${err.message}`, 'Supabase Sync Error', 'warning');
      }
    }
  };

  const handleUpdateProjectStatus = async (id: string, status: 'Active' | 'Completed' | 'Archived') => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));

    if (supabaseStatus === 'connected') {
      try {
        await updateSupabaseProjectStatus(id, status);
        triggerToast(`Status changed to ${status} in Supabase.`, 'Supabase Synced');
      } catch (err: any) {
        console.error("Supabase sync error:", err);
        triggerToast(`Failed to sync status in Supabase: ${err.message}`, 'Supabase Sync Error', 'warning');
      }
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

    if (supabaseStatus === 'connected') {
      try {
        await updateSupabaseProject(updatedProject);
        triggerToast(`Preferences synced with Supabase!`, 'Supabase Synced');
      } catch (err: any) {
        console.error("Supabase sync error:", err);
        triggerToast(`Failed to sync updates to Supabase: ${err.message}`, 'Supabase Sync Error', 'warning');
      }
    }
  };


  // Find active selected project data
  const activeSelectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="flex flex-col min-h-screen bg-background-app text-on-surface font-sans antialiased">
      
      {/* Universal Header - Render unless we are in deep client swiper mode (which has custom layout) */}
      {currentView !== 'swipe' && (
        <Header 
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            // If navigating, close secondary menus
            setNotificationsOpen(false);
          }}
          user={user}
          onSignOut={async () => {
            try {
              await logoutUser();
              setUser(null);
              triggerToast('Signed out of RekaSync workstation.', 'Workspace Cleared');
              setCurrentView('landing');
            } catch (err: any) {
              console.error('Logout error:', err);
              setUser(null);
              triggerToast('Local session cleared.', 'Signed Out');
              setCurrentView('landing');
            }
          }}
          unreadCount={unreadCount}
          onToggleNotifications={handleToggleNotifications}
        />
      )}

      {/* Floating Notifications drawer element */}
      {notificationsOpen && currentView !== 'swipe' && (
        <div className="fixed right-6 top-18 w-80 bg-surface-container border border-outline-variant rounded-2xl shadow-2xl z-40 p-4 space-y-4 animate-fade-in select-none">
          <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
            <h4 className="text-xs font-bold font-headline text-on-surface flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-primary" /> Notifications
            </h4>
            <button 
              onClick={() => setNotificationsOpen(false)}
              className="p-1 hover:bg-surface-container-high rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-1 hover:bg-surface-container-high transition-colors">
                <p className="text-xs font-bold text-on-surface">{notif.title}</p>
                <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">{notif.body}</p>
                <span className="text-[9px] text-primary font-semibold">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary view renderer routing block */}
      <div className="flex-1">
        {currentView === 'landing' && (
          <Landing 
            onNavigate={setCurrentView} 
            onSetDemoProject={handleSetDemoProject} 
          />
        )}
        
        {currentView === 'privacy' && (
          <Privacy onNotify={triggerToast} />
        )}
        
        {currentView === 'signin' && (
          <SignIn 
            onNavigate={setCurrentView} 
            onSignInSuccess={setUser} 
            onNotify={triggerToast} 
          />
        )}
        
        {currentView === 'signup' && (
          <SignUp 
            onNavigate={setCurrentView} 
            onSignUpSuccess={setUser} 
            onNotify={triggerToast} 
          />
        )}
        
        {currentView === 'profile' && (
          <Profile 
            onNavigate={setCurrentView} 
            user={user} 
            onUpdateUser={setUser} 
            onNotify={triggerToast} 
          />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard 
            onNavigate={setCurrentView}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setCurrentView('project-detail');
            }}
            projects={projects}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            onDeleteProject={handleDeleteProject}
            onUpdateProjectStatus={handleUpdateProjectStatus}
          />
        )}
        
        {currentView === 'project-detail' && activeSelectedProject && (
          <ProjectDetail 
            onNavigate={setCurrentView} 
            project={activeSelectedProject} 
            onUpdateStatus={(st) => handleUpdateProjectStatus(activeSelectedProject.id, st)}
            onUpdateProject={handleUpdateProject}
            onNotify={triggerToast}
          />
        )}

        {currentView === 'swipe' && activeSelectedProject && (
          <SwipeClient 
            onBackToProject={() => {
              if (user) {
                setCurrentView('project-detail');
              } else {
                setCurrentView('landing');
              }
            }} 
            project={activeSelectedProject} 
            onUpdateProject={handleUpdateProject}
            onNotify={triggerToast}
          />
        )}
      </div>

      {/* Universal Footer - Render unless in deep client swiper mode */}
      {currentView !== 'swipe' && (
        <Footer onNavigate={setCurrentView} />
      )}

      {/* Global New Project modal */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
        onCreate={handleCreateProject}
      />

      {/* Supabase SQL and setup instructions Modal */}
      <SupabaseSyncModal 
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        status={supabaseStatus}
        errorMessage={supabaseErrorMsg}
        onRetry={initSupabase}
        onSeedSample={handleSeedSampleProjects}
        onWipeDatabase={handleWipeAllProjects}
      />

      {/* Floating Supabase Sync Status Indicator Badge */}
      <div className="fixed bottom-6 left-6 z-[95]">
        <button
          onClick={() => setIsSqlModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-black tracking-wide shadow-lg cursor-pointer transition-all hover:scale-105 active:scale-95 ${
            supabaseStatus === 'connected'
              ? 'bg-tertiary/15 border-tertiary/30 text-tertiary backdrop-blur-md'
              : supabaseStatus === 'testing'
              ? 'bg-surface-container-high border-outline-variant/60 text-on-surface-variant backdrop-blur-md'
              : 'bg-error/15 border-error/30 text-error backdrop-blur-md'
          }`}
          title="Click to view Supabase Connection and Table script Setup"
        >
          <Database className={`w-3.5 h-3.5 ${supabaseStatus === 'connected' ? 'animate-bounce' : ''}`} />
          <span>Supabase: {supabaseStatus === 'connected' ? 'Synced' : supabaseStatus === 'testing' ? 'Testing' : 'Setup Required'}</span>
        </button>
      </div>

      {/* Aesthetic Global Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 max-w-sm rounded-xl bg-surface-container-high border border-outline-variant shadow-2xl flex gap-3 animate-fade-in select-none">
          {toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            {toast.title && <h5 className="text-xs font-bold text-on-surface font-headline">{toast.title}</h5>}
            <p className="text-[11px] text-on-surface-variant leading-relaxed font-sans">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="p-1 hover:bg-surface-container rounded self-start shrink-0 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
