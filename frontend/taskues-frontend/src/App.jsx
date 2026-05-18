import React, { useState } from 'react';
import TaskForm from './components/layout/TaskForm.jsx';
import TaskList from './components/layout/TaskList.jsx';
import { initialTasks } from './utils/mockData.js';
import './App.css';

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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1>TaskUES - Gestión de Tareas</h1>
        <p style={{ color: '#666' }}>Laboratorio 3: Simulación de Consumo de API y Diseño Responsivo</p>
      </header>

      <main>
        <TaskForm 
          onSaveTask={handleSaveTask} 
          taskToEdit={taskToEdit} 
          onCancelEdit={handleCancelEdit} 
        />
        <TaskList 
          tasks={tasks} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteTask} 
        />
      </main>
    </div>
  );
}

export default App;