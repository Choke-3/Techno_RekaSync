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
import { X, Sparkles, BellRing, Info, AlertCircle } from 'lucide-react';

interface ToastState {
  message: string;
  title?: string;
  type?: 'success' | 'info' | 'warning';
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Set default logged in state for sandbox visual richness, but they can sign out
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl: string } | null>({
    name: 'Alexander Morgan',
    email: 'alexander.morgan@rekasync.io',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3ShdSe3XCmjYV0bcDQuSudSlNvQL-Y9u5NfaZOg2RdciLLS99iLZrNmSHaoEH9iPC6oz48jpOyKbCSIKJGV6mS8bLFuZ5exJIcHaNnP-UPvkUTCVkZD1NBIhLQZQPSCcGdcNu3G78FRmirs8Pj6m1xU-r8RC3t_4G-XC6JPOkjvcwfyAcKr__sSwlOS3CpMEVWua0KpOZK05gGG8C3yjkAUiY9ahs9jrIBl6mz90ObxFeeajXUaLVuTL89gtpmxmBlWyBAeIz_w'
  });

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

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

  // Project updating wrappers
  const handleCreateProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    triggerToast(`Constructed and synchronized '${newProject.title}' project ledger.`, 'Workspace Generated');
  };

  const handleDeleteProject = (id: string) => {
    const title = projects.find(p => p.id === id)?.title;
    setProjects(projects.filter(p => p.id !== id));
    triggerToast(`Safely deleted project '${title || id}' from database.`, 'Project Purged', 'warning');
  };

  const handleUpdateProjectStatus = (id: string, status: 'Active' | 'Completed' | 'Archived') => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    }));
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
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
          onSignOut={() => {
            setUser(null);
            triggerToast('Signed out of RekaSync workstation.', 'Workspace Cleared');
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
              setCurrentView('project-detail');
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
