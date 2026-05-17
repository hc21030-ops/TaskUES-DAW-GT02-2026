import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error:   'bg-red-50 border-red-400 text-red-800',
  };

  const Icon = type === 'success' ? CheckCircle : XCircle;
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg shadow-lg min-w-70 ${styles[type]}`}>
        <Icon size={20} className={`shrink-0 ${iconColor}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};