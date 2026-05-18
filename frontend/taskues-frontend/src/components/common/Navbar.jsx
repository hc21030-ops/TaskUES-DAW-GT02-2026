import { useAuth } from '../../hooks/useAuth';
import { Menu } from 'lucide-react';

export function Navbar({ setSidebarOpen }) {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6">

      {/* Botón Mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Menu className="w-7 h-7 text-gray-700" />
      </button>

      {/* Espacio derecho */}
      <div className="flex-1" />

      {/* Usuario */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">
          {user?.name}
        </span>

        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
          {user?.name[0] ?? "E"}
        </div>
      </div>

    </header>
  );
}