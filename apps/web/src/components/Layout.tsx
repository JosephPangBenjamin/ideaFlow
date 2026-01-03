import { useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconBulb,
  IconCheckCircle,
  IconApps,
  IconMenuFold,
  IconMenuUnfold,
  IconPoweroff,
  IconSettings,
} from '@arco-design/web-react/icon';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store/ui';
import { useAuth } from '@/hooks/useAuth';
import { spring, hoverAnimation, tapAnimation } from '@/utils/motion';
import { QuickCapture } from '@/features/ideas/components/QuickCapture';
import { QuickCaptureFAB } from '@/features/ideas/components/QuickCaptureFAB';
import { useQuickCaptureHotkey } from '@/features/ideas/hooks/useQuickCaptureHotkey';

const navItems = [
  { path: '/dashboard', icon: IconHome, label: '仪表盘' },
  { path: '/ideas', icon: IconBulb, label: '想法' },
  { path: '/tasks', icon: IconCheckCircle, label: '任务' },
  { path: '/canvas', icon: IconApps, label: '画布' },
  { path: '/settings', icon: IconSettings, label: '设置' },
];

export function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom);
  const { logout, user } = useAuth();
  useQuickCaptureHotkey();

  const handleLogout = async () => {
    await logout();
  };

  // Ref for the sidebar toggle button to prevent focus ring issues
  const toggleRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden relative font-sans text-slate-100">
      {/* Dynamic Background (Starry Night / Aurora) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent opacity-60 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      </div>

      {/* Sidebar with Glassmorphism */}
      <AnimatePresence initial={false} mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ ...spring, damping: 25 }}
            className="h-full z-20 relative border-r border-white/10 bg-slate-900/30 backdrop-blur-xl flex flex-col overflow-hidden whitespace-nowrap"
          >
            {/* Sidebar Header with Close Toggle */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
              {/* Logo */}
              <motion.div
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={hoverAnimation}
                whileTap={tapAnimation}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-bold text-base font-heading">I</span>
                </div>
                <span className="text-lg font-semibold text-white font-heading tracking-tight drop-shadow-sm">
                  IdeaFlow
                </span>
              </motion.div>

              {/* Sidebar Toggle (Close) */}
              <motion.button
                onClick={() => setIsSidebarOpen(false)}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="收起侧边栏"
              >
                <IconMenuFold className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink key={item.path} to={item.path} className="relative block group">
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 bg-blue-500/20 rounded-xl border border-blue-400/20"
                        initial={false}
                        transition={spring}
                      />
                    )}
                    <motion.div
                      className={`relative flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-100 group-hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon
                        className={`w-5 h-5 mr-3 z-10 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                      />
                      <span className="z-10">{item.label}</span>
                    </motion.div>
                  </NavLink>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-white/5 shrink-0 flex items-center justify-between">
              <motion.div
                className="flex items-center px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors duration-200 flex-1 mr-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {}}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 text-white text-xs font-medium border border-white/10">
                  U
                </div>
                <div className="ml-3 overflow-hidden">
                  <span className="text-sm font-medium text-slate-200 block truncate">
                    {user?.username || '用户'}
                  </span>
                  <p className="text-xs text-slate-500 truncate">Pro 账户</p>
                </div>
              </motion.div>

              <motion.button
                onClick={handleLogout}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                title="退出登录"
              >
                <IconPoweroff className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {/* Main Header */}
        <header className="h-16 flex items-center px-6 shrink-0">
          <AnimatePresence>
            {!isSidebarOpen && (
              <motion.button
                ref={toggleRef}
                onClick={() => setIsSidebarOpen(true)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={spring}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-slate-300 hover:text-white transition-colors mr-4"
                title="展开侧边栏"
              >
                <IconMenuUnfold className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            {navItems.find((i) => location.pathname.startsWith(i.path))?.label || '仪表盘'}
          </motion.div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ ...spring, stiffness: 200 }}
            className="max-w-[1600px] mx-auto pb-10"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
      <QuickCapture />
      <QuickCaptureFAB />
    </div>
  );
}
