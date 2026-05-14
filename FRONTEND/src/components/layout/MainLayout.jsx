import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatListPanel from './ChatListPanel';
import ChatWindow from '@components/chat/ChatWindow';
import TasksPage from '@components/tasks/TasksPage';

const MainLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarCollapsed, activeView } = useSelector((state) => state.ui);
  const { activeChat } = useSelector((state) => state.chat);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />

      {activeView === 'tasks' ? (
        /* Tasks View - Full Width */
        <TasksPage />
      ) : (
        <>
          {/* Chat List Panel */}
          <ChatListPanel />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-slate-950">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Header */}
            <Header />

            {/* Chat Window or Empty State */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
              {activeChat ? (
                <ChatWindow />
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
                  <div className="max-w-md w-full text-center">
                    <div className="relative mb-8 inline-block">
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <div className="relative w-32 h-32 mx-auto bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
                        <svg
                          className="w-16 h-16 text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">
                      Welcome to ChatDesk
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Connect with your team instantly. Select a conversation from the left to begin your journey.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-3">
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-800">End-to-End Encrypted</div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default MainLayout;
