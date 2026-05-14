import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from '@store/index';
import MainLayout from '@components/layout/MainLayout';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';

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

function App() {
  return (
    <Provider store={store}>
      <ThemeInitializer>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/chat" element={<MainLayout />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeInitializer>
    </Provider>
  );
}

export default App;
