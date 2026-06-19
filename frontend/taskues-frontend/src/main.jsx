import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UsersProvider } from './context/UsersContext';
import { TasksProvider } from './context/TaskContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsersProvider>
      <TasksProvider>
        <App />
      </TasksProvider>
    </UsersProvider>
  </StrictMode>,
) 