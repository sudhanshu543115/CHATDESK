import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '@components/layout/MainLayout';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';
import ChatWindow from '@components/chat/ChatWindow';
import TasksPage from '@components/tasks/TasksPage';
import ReportForm from '@components/reports/ReportForm';
import { initWebSocket } from '@services/websocket';

// Theme initializer component
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
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Sub-component to hold the WebSocket listener under the Redux context
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
  return (
    <ThemeInitializer>
      <BrowserRouter>
        <WebSocketManager>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/chat" element={<ChatWindow />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/reports" element={<ReportForm />} />
                      <Route path="/" element={<Navigate to="/chat" />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </WebSocketManager>
      </BrowserRouter>
    </ThemeInitializer>
  );
};

export default App;
