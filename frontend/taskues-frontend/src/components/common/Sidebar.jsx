import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@heroui/react";
//import { LayoutDashboard, Users, Users2, LogOut } from 'lucide-react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ShieldCheck,
  Users2, LogOut,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ mobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/users', label: 'Usuarios', icon: Users },
    { path: '/tasks', label: 'Tareas', icon: FolderKanban }

  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 sm:w-72
    lg:w-64
    h-screen
    bg-white
    border
    border-gray-200
    flex
    flex-col">
      {/* Logo */}
      <section className="flex flex-col items-center p-6 border-b border-gray-800">

        <div className="bg-blue-900 p-4 mb-2 rounded-2xl shadow-md cursor-pointer" onClick={() => navigate('/')}>
          <CheckCircle2
            size={40}
            className="text-white"
          />
        </div>
      </section>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                ? 'bg-blue-800 text-white'
                : 'text-black hover:bg-gray-200'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-200 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

function MenuItem({ icon, title, active }) {
  return (
    <button
      className={`
        flex items-center gap-3
        w-full px-4 py-3 rounded-xl
        transition
        ${active
          ? "bg-blue-600 text-white"
          : "hover:bg-zinc-100 text-zinc-600"
        }
      `}
    >
      {icon}
      <span className="font-medium">
        {title}
      </span>
    </button>
  );
}