import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

import { useEffect } from 'react';
import UserCreatePage from './pages/users/UserCreatePage';

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
        <Route path="/"  element={<UserCreatePage />} />
        <Route path="/users/Create" element={<UserCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
