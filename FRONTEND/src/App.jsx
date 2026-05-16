import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '@components/layout/MainLayout';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';
import ChatWindow from '@components/chat/ChatWindow';
import TasksPage from '@components/tasks/TasksPage';
import ReportForm from '@components/reports/ReportForm';
import { initWebSocket } from '@services/websocket';

const ThemeInitializer = ({ children }) => {
  const { theme } = useSelector((state) => state.ui);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const WebSocketManager = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initWebSocket(user.id);
    }
  }, [isAuthenticated, user?.id]);
  return children;
};

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <ThemeInitializer>
      <Router>
        <WebSocketManager>
          <Routes>
            {/* If logged in, the root should skip login and go to dashboard */}
            <Route 
              index 
              element={isAuthenticated ? <Navigate to="dashboard/chat" replace /> : <LoginForm />} 
            />
            <Route path="register" element={<RegisterForm />} />
            
            <Route
              path="dashboard/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="chat" element={<ChatWindow />} />
                      <Route path="groups" element={<ChatWindow />} />
                      <Route path="channels" element={<ChatWindow />} />
                      <Route path="tasks" element={<TasksPage />} />
                      <Route path="reports" element={<ReportForm />} />
                      <Route path="*" element={<Navigate to="chat" replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WebSocketManager>
      </Router>
    </ThemeInitializer>
  );
};

export default App;