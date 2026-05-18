import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

import { useEffect } from 'react';
import UserCreatePage from './pages/users/UserCreatePage';

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // Simulación PUT
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
      setTaskToEdit(null);
      alert(`[Simulación PUT] Tarea ID ${taskData.id} actualizada con éxito.`);
    } else {
      // Simulación POST
      const newTask = {
        ...taskData,
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
      };
      setTasks([...tasks, newTask]);
      alert(`[Simulación POST] Nueva tarea creada bajo el ID ${newTask.id}.`);
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
  };

  const handleCancelEdit = () => {
    setTaskToEdit(null);
  };

  const handleDeleteTask = (id) => {
    // Simulación DELETE
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar la tarea con ID: ${id}? (Simulación DELETE)`);
    if (confirmDelete) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<UserCreatePage />} />
        <Route path="/users/Create" element={<UserCreatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;