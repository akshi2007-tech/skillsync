import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';

const Landing = lazy(() => import('./pages/Landing').then(m => ({ default:m.Landing })));
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default:m.Onboarding })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default:m.Dashboard })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default:m.Events })));
const Assistant = lazy(() => import('./pages/Assistant').then(m => ({ default:m.Assistant })));
const AssistantWidget = lazy(() => import('./pages/Assistant').then(m => ({ default:m.AssistantWidget })));
const Teams = lazy(() => import('./pages/Teams').then(m => ({ default:m.Teams })));
const Students = lazy(() => import('./pages/Students').then(m => ({ default:m.Students })));
const StudentDetail = lazy(() => import('./pages/Students').then(m => ({ default:m.StudentDetail })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default:m.Profile })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default:m.AuthPage })));
const EventDetail = lazy(() => import('./pages/EventDetail').then(m => ({ default:m.EventDetail })));
const TeamFormation = lazy(() => import('./pages/TeamFormation').then(m => ({ default:m.TeamFormation })));
const TeamDetail = lazy(() => import('./pages/Teams').then(m => ({ default:m.TeamDetail })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default:m.AdminDashboard })));

const RouteSkeleton = () => <div className="min-h-screen bg-[#F6F3EE] p-8 dark:bg-[#151412]" role="status" aria-label="Loading page"><div className="mx-auto max-w-5xl animate-pulse space-y-5"><div className="h-12 w-56 rounded-2xl bg-black/5 dark:bg-white/10"/><div className="grid gap-4 md:grid-cols-3"><div className="h-48 rounded-3xl bg-black/5 dark:bg-white/10"/><div className="h-48 rounded-3xl bg-black/5 dark:bg-white/10"/><div className="h-48 rounded-3xl bg-black/5 dark:bg-white/10"/></div></div></div>;

function StaffRoute({children,adminOnly=false}){
  const {user,loading}=useAuth();const location=useLocation();
  if(loading)return <RouteSkeleton/>;
  if(!user)return <Navigate to="/login" replace state={{from:location.pathname}}/>;
  if(user.role==='STUDENT'||(adminOnly&&user.role!=='ADMIN'))return <Navigate to="/dashboard" replace/>;
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F3EE] dark:bg-[#151412] flex items-center justify-center">
        <div className="flex gap-2" role="status" aria-label="Loading"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#cf806d]"/><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#d6b64f] [animation-delay:120ms]"/><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#75a16e] [animation-delay:240ms]"/></div>
      </div>
    );
  }

  // Allow guest access for landing, or redirect to home if not logged in
  if (!user && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  if (location.pathname === '/' || location.pathname === '/onboarding') {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EE] dark:bg-[#151412] text-[#141414] dark:text-[#f6f3ee] transition-colors">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export function App() {
  const AnimatedRoutes = () => {
    const location = useLocation();
    return <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.18}}><Suspense fallback={<RouteSkeleton />}><Routes location={location}>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/register" element={<AuthPage initialMode="register" />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/events" element={<ProtectedLayout><Events /></ProtectedLayout>} />
      <Route path="/events/:id" element={<ProtectedLayout><EventDetail /></ProtectedLayout>} />
      <Route path="/assistant" element={<ProtectedLayout><Assistant /></ProtectedLayout>} />
      <Route path="/ai-matchmaker" element={<Navigate to="/assistant" replace />} />
      <Route path="/teams" element={<ProtectedLayout><Teams /></ProtectedLayout>} />
      <Route path="/teams/create" element={<ProtectedLayout><TeamFormation /></ProtectedLayout>} />
      <Route path="/teams/:id" element={<ProtectedLayout><TeamDetail /></ProtectedLayout>} />
      <Route path="/students" element={<ProtectedLayout><Students /></ProtectedLayout>} />
      <Route path="/students/:id" element={<ProtectedLayout><StudentDetail /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
      <Route path="/studio" element={<StaffRoute><AdminDashboard /></StaffRoute>} />
      <Route path="/admin" element={<StaffRoute adminOnly><AdminDashboard /></StaffRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></Suspense></motion.div></AnimatePresence>;
  };
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AnimatedRoutes />
            <Suspense fallback={null}><AssistantWidget /></Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
