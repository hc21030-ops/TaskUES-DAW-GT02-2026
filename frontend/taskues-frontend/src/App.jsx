import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { UsersListPage } from "./pages/users/UsersListPage";
import { useAuthStore } from "./store/authStore";
import { UserCreatePage } from "./pages/users/UserCreatePage";
import { UserEditPage } from "./pages/users/UserEditPage";
import { TaskListPage } from "./pages/tasks/TaskListPage";
import { ProjectsListPage } from "./pages/projects/ProjectsListPage";
import { ProjectCreatePage } from "./pages/projects/ProjectCreatePage";
import { ProjectDetailPage } from "./pages/projects/ProjectDetailPage";
import { CategoriesPage }   from "./pages/projects/CategoriesPage";
import { KanbanPage }       from "./pages/projects/KanbanPage";
import { TaskCreatePage }   from "./pages/tasks/TaskCreatePage";

function App() {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadUser = useAuthStore((state) => state.loadUser);
  
  const [checkingSession, setCheckingSession] = useState(true);
 
  useEffect(() => {
    loadUser();
    setCheckingSession(false);
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
 
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
 
            <Route path="/users" element={<UsersListPage />} />
            <Route path="/users/create" element={<UserCreatePage />} />
            <Route path="/users/:id/edit" element={<UserEditPage />} />
            <Route path="/tasks" element={<TaskListPage />} />
 
            <Route path="/projects"                        element={<ProjectsListPage />} />
            <Route path="/projects/create"                 element={<ProjectCreatePage />} />
            <Route path="/projects/:id"                    element={<ProjectDetailPage />} />
            <Route path="/projects/:id/categories"         element={<CategoriesPage />} />
            <Route path="/projects/:id/kanban"             element={<KanbanPage />} />
            <Route path="/projects/:id/tasks/create"       element={<TaskCreatePage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
