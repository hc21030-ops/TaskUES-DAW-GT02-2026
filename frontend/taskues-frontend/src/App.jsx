import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

import { useEffect } from 'react';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { UsersListPage } from './pages/users/UsersListPage';
import { useAuthStore } from './store/authStore';
import { UserCreatePage } from './pages/users/UserCreatePage';
import { UserEditPage } from './pages/users/UserEditPage';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, []);

  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
